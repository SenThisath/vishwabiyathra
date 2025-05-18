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
import React, { useState, useEffect } from "react";

const Meeting = ({ id }: { id: string }) => {
  const [call, setCall] = useState<Call>();
  const [deviceStatus, setDeviceStatus] = useState({
    camera: false,
    microphone: false,
  });
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
      const newCall = client.call("default", id);
      await newCall.join();
      setCall(newCall);
    } else {
      alert("Please ensure camera and microphone are enabled before joining");
    }
  };

  // Loading state
  if (!client) return;

  // Pre-meeting device check state
  if (!call) {
    return (
      <div className="p-4 flex flex-col gap-4 items-center justify-center">
        <h2 className="text-xl font-bold">Device Status Check</h2>

        <div className="flex flex-col gap-2 w-full max-w-md">
          <div className="flex justify-between items-center">
            <span>Camera:</span>
            <span
              className={
                deviceStatus.camera ? "text-green-500" : "text-red-500"
              }
            >
              {deviceStatus.camera ? "Ready" : "Not Ready"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span>Microphone:</span>
            <span
              className={
                deviceStatus.microphone ? "text-green-500" : "text-red-500"
              }
            >
              {deviceStatus.microphone ? "Ready" : "Not Ready"}
            </span>
          </div>
        </div>

        <Button
          onClick={handleJoinMeeting}
          disabled={!deviceStatus.camera || !deviceStatus.microphone}
          className="mt-4"
        >
          Join Meeting
        </Button>
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
