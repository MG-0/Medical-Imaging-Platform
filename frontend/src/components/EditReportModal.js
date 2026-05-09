import React from "react";
import { Dialog, Flex } from "@radix-ui/themes";
import { Edit, Save } from "lucide-react";

const EditReportModal = ({ open, setOpen, editingScan, editForm, setEditForm, isSaving, onSubmit }) => {
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Content maxWidth="550px" className="rounded-3xl p-8 shadow-2xl">
        <Dialog.Title className="text-2xl font-extrabold flex items-center gap-3 text-slate-800 mb-2">
          <div className="bg-indigo-50 p-3 rounded-xl"><Edit size={24} className="text-indigo-600" /></div>
          Edit Final Report
        </Dialog.Title>
        <Dialog.Description size="2" className="text-slate-500 mb-6 font-medium">
          Update the diagnosis and recommendations for patient <span className="font-bold text-slate-700">{editingScan?.patient?.name}</span>.
        </Dialog.Description>

        <Flex direction="column" gap="5" className="mb-2">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-slate-700 text-sm ml-1">Final Diagnosis</label>
            <textarea
              value={editForm.diagnosis}
              onChange={(e) => setEditForm(prev => ({...prev, diagnosis: e.target.value}))}
              className="bg-slate-50 border-2 border-slate-200 text-slate-800 px-4 py-4 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium resize-none"
              rows={4}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-bold text-slate-700 text-sm ml-1">Recommendations & Strategy</label>
            <textarea
              value={editForm.recommendations}
              onChange={(e) => setEditForm(prev => ({...prev, recommendations: e.target.value}))}
              className="bg-slate-50 border-2 border-slate-200 text-slate-800 px-4 py-4 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium resize-none"
              rows={3}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-bold text-slate-700 text-sm ml-1">Assessed Severity</label>
            <select
              value={editForm.severity}
              onChange={(e) => setEditForm(prev => ({...prev, severity: e.target.value}))}
              className="bg-slate-50 border-2 border-slate-200 text-slate-800 px-4 py-4 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all cursor-pointer font-bold"
            >
              <option value="Low" className="text-emerald-700">Low</option>
              <option value="Medium" className="text-amber-600">Medium</option>
              <option value="High" className="text-orange-600">High</option>
              <option value="Critical" className="text-red-700">Critical</option>
            </select>
          </div>
        </Flex>

        <Flex gap="3" mt="8" justify="end" align="center">
          <Dialog.Close>
            <button disabled={isSaving} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors">
              Cancel
            </button>
          </Dialog.Close>
          <button 
            onClick={onSubmit}
            disabled={isSaving}
            className={`px-8 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 ${isSaving ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg active:scale-95'}`}
          >
            {isSaving ? 'Saving...' : <><Save size={18} /> Update Record</>}
          </button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default EditReportModal;
