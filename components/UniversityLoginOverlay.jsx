import { ConnectWallet, useConnectionStatus } from "@thirdweb-dev/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

const UniversityLoginOverlay = ({ onClose }) => {
  const router = useRouter();
  const connectionStatus = useConnectionStatus();

  useEffect(() => {
    if (connectionStatus === "connected") {
      router.push("/university/universityDashboard");
      onClose();
    }
  }, [connectionStatus, router, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">University Login</h2>
        <div className="space-y-4">
          <ConnectWallet
            theme="light"
            className="w-full"
            auth={{ loginOptional: false }}
            switchToActiveChain={true}
          />
          <p className="text-sm text-gray-600 text-center mt-4">
            Connect your wallet to access the university dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default UniversityLoginOverlay;