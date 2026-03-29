import SuccessModal from "../successModal";
import { useState } from "react";

export default function EditModal({
  onCancel,
  icon,
  title,
  formEdit: FormEditUser,
  initialData,
  successTitle,
  successMessage,
}) {
  const [showSuccess, setShowSuccess] = useState(false);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="font-semibold">{title}</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-white/80 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>
        {/* defau;t form */}
        <div className="p-5 overflow-y-auto">
          <FormEditUser
            onCancel={onCancel}
            initialData={initialData}
            onSuccess={() => setShowSuccess(true)}
          />
        </div>
      </div>
    </div>
  );
}
