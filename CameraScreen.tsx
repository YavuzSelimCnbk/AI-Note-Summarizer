/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Camera, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '../components/Button';

interface CameraScreenProps {
  key?: React.Key;
  onCapture: (base64Image: string) => void;
  onCancel: () => void;
}

/**
 * Screen for capturing a photo using the device camera or uploading an image.
 */
export function CameraScreen({ onCapture, onCancel }: CameraScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
      setError(null);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access the camera. Please ensure permissions are granted or use the upload option.');
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  }, [stream]);

  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Image = canvas.toDataURL('image/jpeg', 0.9);
        stopCamera();
        onCapture(base64Image);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onCapture(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
    >
      {/* Close Button */}
      <div className="absolute top-6 right-6 z-50">
        <Button variant="ghost" size="icon" onClick={() => { stopCamera(); onCancel(); }} className="text-white hover:bg-white/20">
          <X className="w-8 h-8" />
        </Button>
      </div>

      <div className="w-full max-w-4xl px-4 flex flex-col items-center">
        {isCameraActive ? (
          <div className="relative w-full aspect-[4/3] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Camera Controls Overlay */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center space-x-8">
              <Button
                variant="primary"
                size="icon"
                onClick={handleCapture}
                className="w-20 h-20 rounded-full bg-white text-black hover:bg-gray-200 shadow-[0_0_0_4px_rgba(255,255,255,0.3)]"
              >
                <div className="w-16 h-16 rounded-full border-2 border-black" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 text-center space-y-8">
            <div className="space-y-4">
              <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto">
                <Camera className="w-10 h-10 text-indigo-300" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Capture Note</h2>
              <p className="text-slate-300">
                Take a photo of your handwritten notes or upload an existing image to summarize.
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col space-y-4">
              <Button variant="primary" size="lg" onClick={startCamera} className="w-full justify-center">
                <Camera className="w-5 h-5 mr-2" />
                Open Camera
              </Button>
              
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Upload image"
                />
                <Button variant="secondary" size="lg" className="w-full justify-center pointer-events-none">
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Upload Image
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
