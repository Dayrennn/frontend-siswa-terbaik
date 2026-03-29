"use client";

import SuccessModal from "../successModal";
import { useState } from "react";

export default function CreateModal({
  onCancel,
  icon,
  title,
  formTambah: FormTambahUser,
  otpComponent: OtpComponent,
  successTitle = "Berhasil",
  successMessage = "Data berhasil disimpan",
}) {
  const [step, setStep] = useState("form");
  const [email, setEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFormSuccess = (result, formData) => {
    if (OtpComponent) {
      setEmail(formData.email);
      setStep("otp");
    } else {
      setShowSuccess(true);
    }
  };

  const handleOtpSuccess = () => {
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <SuccessModal
        title={successTitle}
        message={successMessage}
        onClose={onCancel}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="font-semibold">
              {step === "form" ? title : "Verifikasi OTP"}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="text-white/80 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        {/* Body Default */}
        <div className="p-5">
          {step === "form" && (
            <FormTambahUser onSuccess={handleFormSuccess} onCancel={onCancel} />
          )}
          {step === "otp" && OtpComponent && (
            <OtpComponent
              email={email}
              onCancel={onCancel}
              onSuccess={handleOtpSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
}
