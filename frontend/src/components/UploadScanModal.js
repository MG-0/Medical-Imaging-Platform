import React, { useState } from "react";
import { Dialog, Flex } from "@radix-ui/themes";
import { UploadCloud } from "lucide-react";

const UploadScanModal = ({ open, setOpen, doctors, uploading, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState("");

  // Update selected doctor if doctors list changes and nothing is selected
  React.useEffect(() => {
    if (doctors.length > 0 && !selectedDoctor) {
      setSelectedDoctor(doctors[0]._id);
    }
  }, [doctors, selectedDoctor]);

  const handleSubmit = () => {
    onUpload(selectedFile, selectedDoctor, () => {
      setSelectedFile(null);
      setOpen(false);
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Content maxWidth="550px" className="rounded-3xl p-8 shadow-2xl">
        <Dialog.Title className="text-2xl font-extrabold flex items-center gap-3 text-slate-800 mb-2">
          <div className="bg-blue-50 p-3 rounded-xl"><UploadCloud size={24} className="text-blue-600" /></div>
          Secure Upload
        </Dialog.Title>
        <Dialog.Description size="2" className="text-slate-500 mb-6 font-medium">
          Select an MRI scan image and explicitly choose a certified doctor to securely review your case.
        </Dialog.Description>

        <Flex direction="column" gap="5" className="mb-2">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-slate-700 text-sm ml-1">MRI Image File</label>
            <input
              type="file"
              accept=".img,.nii,.nii.gz,.png,.jpg,.jpeg"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-extrabold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer bg-slate-50 rounded-2xl border-2 border-slate-100 p-2 outline-none group focus-within:border-blue-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-slate-700 text-sm ml-1">Assign to Specialist</label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-200 text-slate-800 px-4 py-4 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer font-bold appearance-none"
            >
               <option value="" disabled>
                 {doctors.length > 0 ? "Select a doctor..." : "Loading specialists..."}
               </option>
               {doctors.map(doc => (
                 <option key={doc._id} value={doc._id}>Dr. {doc.name}</option>
               ))}
               {doctors.length === 0 && (
                 <option value="" disabled>No specialists available</option>
               )}
            </select>
          </div>
        </Flex>

        <Flex gap="3" mt="8" justify="end" align="center">
          <Dialog.Close>
            <button disabled={uploading} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors">
              Cancel
            </button>
          </Dialog.Close>
          <button 
            onClick={handleSubmit}
            disabled={uploading || !selectedFile || !selectedDoctor}
            className={`px-8 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 ${uploading || !selectedFile || !selectedDoctor ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-95'}`}
          >
            {uploading ? 'Processing...' : <><UploadCloud size={18} /> Transmit Scan</>}
          </button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default UploadScanModal;
