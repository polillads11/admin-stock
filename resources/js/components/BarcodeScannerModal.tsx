import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDetected: (code: string) => void;
}

const BarcodeScannerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onDetected,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");

  const playBeep = () => {
    const audio = new Audio("/beep.mp3");
    audio.play();
  };

  const startScanner = (deviceId: string) => {
    if (!videoRef.current) return;

    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    codeReader.decodeFromVideoDevice(deviceId, videoRef.current, (result) => {
      if (result) {
        playBeep();
        const barcodeValue = result.getText();

        onDetected(barcodeValue);
        handleClose();
      }
    });
  };

  useEffect(() => {
    if (!isOpen) return;

    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter((d) => d.kind === "videoinput");

      setDevices(videoDevices);

      if (videoDevices.length > 0) {
        const defaultDevice = videoDevices[0].deviceId;
        setSelectedDeviceId(defaultDevice);
        startScanner(defaultDevice);
      }
    });

    return () => stopScanner();
  }, [isOpen]);

  const stopScanner = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const handleCameraChange = (deviceId: string) => {
    stopScanner();
    setSelectedDeviceId(deviceId);
    startScanner(deviceId);
  };

  const handleClose = () => {
    stopScanner();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>Escanear Código</h2>

        {/* Selector de cámara */}
        {devices.length > 1 && (
          <select
            value={selectedDeviceId}
            onChange={(e) => handleCameraChange(e.target.value)}
            style={{ marginBottom: 10, width: "100%" }}
          >
            {devices.map((device, index) => (
              <option key={device.deviceId} value={device.deviceId}>
                Cámara {index + 1}
              </option>
            ))}
          </select>
        )}

        <video
          ref={videoRef}
          style={{ width: "100%", borderRadius: 8 }}
        />

        <button onClick={handleClose} style={buttonStyle}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default BarcodeScannerModal;

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: 20,
  borderRadius: 12,
  width: 400,
};

const buttonStyle: React.CSSProperties = {
  marginTop: 10,
  padding: "8px 16px",
};