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

  // 🔊 Sonido beep
  const playBeep = () => {
    const audio = new Audio("/beep.mp3"); // Colocar archivo en /public
    audio.play();
  };

  useEffect(() => {
    if (!isOpen) return;

    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    navigator.mediaDevices.enumerateDevices().then((videoInputDevices) => {
      const videoDevices = videoInputDevices.filter(
        (device) => device.kind === "videoinput"
      );
      setDevices(videoDevices);

      if (videoDevices.length > 0) {
        codeReader.decodeFromVideoDevice(
          videoDevices[0].deviceId,
          videoRef.current!,
          (result, err) => {
            if (result) {
              playBeep(); // 🔊 beep al detectar
              onDetected(result.getText());
              handleClose();
            }
          }
        );
      }
    });

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  const handleClose = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>Escanear Código</h2>

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

// 🎨 estilos simples
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