"use client";

import { Button } from "@/components/ui/button";
import {
  Call,
  CallControls,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import React, { useState, useEffect } from "react";


const Meeting = ({ params }: { params: { id: string } }) => {
  const [call, setCall] = useState<Call>();
  const [deviceStatus, setDeviceStatus] = useState({
    camera: false,
    microphone: false,
    screenShare: false,
  });
  const [isJoined, setIsJoined] = useState(false);
  const client = useStreamVideoClient();

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

  // Function to check screen sharing capability
  const checkScreenShare = async () => {
    try {
      if (!navigator.mediaDevices.getDisplayMedia) {
        setDeviceStatus((prev) => ({ ...prev, screenShare: false }));
        return false;
      }
      setDeviceStatus((prev) => ({ ...prev, screenShare: true }));
      return true;
    } catch (error) {
      console.error("Screen share check error:", error);
      setDeviceStatus((prev) => ({ ...prev, screenShare: false }));
      return false;
    }
  };

  // Check all devices when component mounts
  useEffect(() => {
    const checkAllDevices = async () => {
      await checkCamera();
      await checkMicrophone();
      await checkScreenShare();
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
    const screenShareReady = await checkScreenShare();

    if (cameraReady && microphoneReady && screenShareReady) {
      const newCall = client.call("default", params.id);
      await newCall.join();
      setCall(newCall);
      setIsJoined(true);
    } else {
      alert(
        "Please ensure camera, microphone and screen sharing are enabled before joining",
      );
    }
  };

  const handleDoneClick = () => {
    console.log("done");
  };

  // Loading state
  if (!client) return <div>Loading...</div>;

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

          <div className="flex justify-between items-center">
            <span>Screen Share:</span>
            <span
              className={
                deviceStatus.screenShare ? "text-green-500" : "text-red-500"
              }
            >
              {deviceStatus.screenShare ? "Ready" : "Not Ready"}
            </span>
          </div>
        </div>

        <Button
          onClick={handleJoinMeeting}
          disabled={
            !deviceStatus.camera ||
            !deviceStatus.microphone ||
            !deviceStatus.screenShare
          }
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
        <SpeakerLayout />
        <StreamTheme>
          <CallControls />
        </StreamTheme>
      </StreamCall>

      {isJoined && (
        <div className="absolute top-4 right-4">
          <Button onClick={handleDoneClick}>Done</Button>
        </div>
      )}
    </div>
  );
};

export default Meeting;
