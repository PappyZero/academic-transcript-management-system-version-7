import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { connectDB } from "../../../utils/db";
import { ethers } from "ethers";

// Create a direct MongoDB client instance for the adapter
const clientPromise = connectDB().then(({ client }) => client);

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        address: { label: "Wallet Address", type: "text" },
        signature: { label: "Signature", type: "text" },
        role: { label: "Role", type: "text" },
        nonce: { label: "Nonce", type: "text" }
      },
      async authorize(credentials) {
        try {
          const { db } = await connectDB();

          // Verify signature
          const message = `Welcome to ATMS!\n\nSign in as ${credentials.role}\nNonce: ${credentials.nonce}`;
          const verifiedAddress = ethers.verifyMessage(message, credentials.signature);

          // Validate address matches
          if (verifiedAddress.toLowerCase() !== credentials.address.toLowerCase()) {
            throw new Error("Address doesn't match signature");
          }

          // Validate nonce
          const nonceDoc = await db.collection('nonces').findOne({ 
            address: verifiedAddress,
            nonce: credentials.nonce
          });

          if (!nonceDoc) {
            throw new Error("Invalid or expired nonce");
          }

          // Check nonce expiration
          if (new Date() > nonceDoc.expiresAt) {
            await db.collection('nonces').deleteOne({ _id: nonceDoc._id });
            throw new Error("Nonce has expired");
          }

          // Cleanup used nonce
          await db.collection('nonces').deleteOne({ _id: nonceDoc._id });

          // Find user
          const user = await db.collection("users").findOne({
            walletAddress: verifiedAddress,
            role: credentials.role
          });

          if (!user) throw new Error("Account not found for this role");

          // Return user data with role-specific details
          let userData = {
            id: user._id.toString(),
            role: user.role,
            walletAddress: user.walletAddress,
          };

          switch (user.role) {
            case "university":
              userData = {
                ...userData,
                ...user.universityDetails,
                permissions: {
                  read: true,
                  write: true,
                  delete: true,
                  share: true,
                  revoke: true,
                },
              };
              break;

            case "student":
              userData = {
                ...userData,
                ...user.studentDetails,
                permissions: {
                  read: true,
                  write: false,
                  delete: false,
                  requestTranscript: true,
                  viewShared: true,
                },
              };
              break;

            case "verifier":
              userData = {
                ...userData,
                ...user.verifierDetails,
                permissions: {
                  read: true,
                  write: false,
                  verify: true,
                  compareHashes: true,
                },
              };
              break;
          }

          return userData;

        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.userId = user.id;
        token.walletAddress = user.walletAddress;

        // Role-specific JWT additions
        switch (user.role) {
          case "university":
            token.universityId = user.universityId;
            token.institution = user.institution;
            token.permissions = user.permissions;
            break;

          case "student":
            token.studentId = user.studentId;
            token.matricNumber = user.matricNumber;
            token.permissions = user.permissions;
            break;

          case "verifier":
            token.verifierId = user.verifierId;
            token.organization = user.organization;
            token.permissions = user.permissions;
            break;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.userId,
        role: token.role,
        walletAddress: token.walletAddress,
        permissions: token.permissions
      };

      // Add role-specific session data
      switch (token.role) {
        case "university":
          session.user.universityId = token.universityId;
          session.user.institution = token.institution;
          session.user.isUniversity = true;
          break;

        case "student":
          session.user.studentId = token.studentId;
          session.user.matricNumber = token.matricNumber;
          session.user.canView = true;
          break;

        case "verifier":
          session.user.verifierId = token.verifierId;
          session.user.organization = token.organization;
          session.user.canVerify = true;
          break;
      }

      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    signOut: "/auth/signout"
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 4 * 60 * 60, // 4 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  logger: {
    error(code, metadata) {
      console.error(code, metadata);
    },
    warn(code) {
      console.warn(code);
    },
    debug(code, metadata) {
      console.debug(code, metadata);
    },
  },
  debug: process.env.NODE_ENV === "development",
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};

export default NextAuth(authOptions);