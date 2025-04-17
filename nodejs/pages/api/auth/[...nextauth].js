import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { connectDB } from "../../../utils/db";
import { ethers } from "ethers";

export const authOptions = {
  adapter: MongoDBAdapter({
    db: async () => {
      const { client, db } = await connectDB();
      return { client, db }; // Adapter needs both client and db
    },
  }),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        walletAddress: { label: "Wallet Address", type: "text" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        try {
          const { db } = await connectDB();

          console.log("Received Credentials:", credentials); // Debugging log

          // Validate wallet address format
          if (!ethers.isAddress(credentials.walletAddress)) {
            throw new Error("Invalid wallet address format");
          }

          // Normalize wallet address
          const normalizedAddress = ethers.getAddress(credentials.walletAddress);
          console.log("Normalized Address:", normalizedAddress); // Debugging log

          // Find user with role-specific details
          const user = await db.collection("users").findOne(
            {
              walletAddress: normalizedAddress,
              role: credentials.role,
            },
            {
              projection: {
                _id: 1,
                role: 1,
                walletAddress: 1,
                universityDetails: 1,
                studentDetails: 1,
                verifierDetails: 1,
              },
            }
          );

          if (!user) {
            throw new Error("Account not found for this role");
          }

          console.log("Authenticated User:", user); // Debugging log

          // Role-specific data enrichment
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
          console.error("Authentication error:", error); // Debugging log
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
            break;

          case "student":
            token.studentId = user.studentId;
            token.matricNumber = user.matricNumber;
            break;

          case "verifier":
            token.verifierId = user.verifierId;
            token.organization = user.organization;
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
        permissions: token.permissions // Add this line
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
};

export default NextAuth(authOptions);