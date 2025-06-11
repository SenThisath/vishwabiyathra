"use client";

import QuizApp from "@/app/quiz/[id]/quiz/page";
import { Button } from "@/components/ui/button";
import { Roles } from "@/types/globals";
import { useUser } from "@clerk/nextjs";
import {
  Call,
  CallControls,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";

const Meeting = () => {
  const [call, setCall] = useState<Call>();
  const [deviceStatus, setDeviceStatus] = useState({
    camera: false,
    microphone: false,
  });
  const params = useParams();
  const client = useStreamVideoClient();
  const { user } = useUser();
  const [role, setRole] = useState<Roles | undefined>();
  useEffect(() => {
    if (user) {
      const role: Roles = user.publicMetadata.role as Roles;
      setRole(role);
    }
  }, [user]);

  // Function to check camera status
  const checkCamera = async () => {
    try {
      const devices = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setDeviceStatus((prev) => ({ ...prev, camera: true }));
      // Stop using the camera after checking
      devices.getTracks().forEach((track) => track.stop());
      return true;
    } catch (error) {
      console.error("Camera access error:", error);
      setDeviceStatus((prev) => ({ ...prev, camera: false }));
      return false;
    }
  };

  // Function to check microphone status
  const checkMicrophone = async () => {
    try {
      const devices = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setDeviceStatus((prev) => ({ ...prev, microphone: true }));
      // Stop using the microphone after checking
      devices.getTracks().forEach((track) => track.stop());
      return true;
    } catch (error) {
      console.error("Microphone access error:", error);
      setDeviceStatus((prev) => ({ ...prev, microphone: false }));
      return false;
    }
  };

  // Check all devices when component mounts
  useEffect(() => {
    const checkAllDevices = async () => {
      await checkCamera();
      await checkMicrophone();
    };

    if (client) {
      checkAllDevices();
    }
  }, [client]);

  const handleJoinMeeting = async () => {
    if (!client) return;

    // Verify all devices are ready
    const cameraReady = await checkCamera();
    const microphoneReady = await checkMicrophone();

    if (cameraReady && microphoneReady) {
      const newCall = client.call("default", params.id as string);
      await newCall.join();
      setCall(newCall);
    } else {
      alert("Please ensure camera and microphone are enabled before joining");
    }
  };

  // Loading state
  if (!client) return <div>Loading...</div>;

  // Pre-meeting device check state
  if (!call) {
    return (
      <div className="p-8 flex flex-col gap-6 items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md backdrop-blur-sm bg-opacity-90 border border-gray-100">
          <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Meeting Preparation
          </h2>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-gray-50 border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="font-medium text-gray-700">Camera</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${deviceStatus.camera ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {deviceStatus.camera ? "Ready" : "Not Ready"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                  <span className="font-medium text-gray-700">Microphone</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${deviceStatus.microphone ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {deviceStatus.microphone ? "Ready" : "Not Ready"}
                </span>
              </div>
            </div>

            <Button
              onClick={handleJoinMeeting}
              disabled={!deviceStatus.camera || !deviceStatus.microphone}
              className={`w-full py-3 text-lg font-medium transition-all duration-300 ${
                deviceStatus.camera && deviceStatus.microphone
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              {deviceStatus.camera && deviceStatus.microphone
                ? "Join Meeting"
                : "Please Enable Devices"}
            </Button>
          </div>
        </div>
      </div>
    );
  }
  // In-call state
  return (
    <div className="relative">
      <StreamCall call={call}>
        {role === "admin" ? (
          <>
            <SpeakerLayout />
            <StreamTheme>
              <CallControls />
            </StreamTheme>
          </>
        ) : (
          <QuizApp />
        )}
      </StreamCall>
      {/* 
      {isJoined && (
        <div className="absolute top-4 right-4">
          <Button onClick={handleDoneClick}>Done</Button>
        </div>
      )} */}
    </div>
  );
};

export default Meeting;
