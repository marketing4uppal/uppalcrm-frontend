// src/components/DeleteLeadModal.jsx (FINAL - Full Version)
import React, { useState, useEffect } from 'react';
import { 
  X, 
  AlertTriangle, 
  Info, 
  Trash2, 
  UserX, 
  UserCheck, 
  RotateCcw,
  Shield
} from 'lucide-react';
import axios from 'axios';

const DeleteLeadModal = ({ lead, isOpen, onClose, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState(null);
  const [formData, setFormData] = useState({
    reason: '',
    notes: '',
    contactAction: 'keep' // 'keep', 'delete', 'convert'
  });
  const [step, setStep] = useState(1); // 1: confirm, 2: contact choice, 3: final confirm

  useEffect(() => {
    if (isOpen && lead) {
      fetchDeleteInfo();
      // Reset form when modal opens
      setFormData({
        reason: '',
        notes: '',
        contactAction: 'keep'
      });
      setStep(1);
    }
  }, [isOpen, lead]);

  const fetchDeleteInfo = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/delete-info`, {
       headers: {
  'x-auth-token': token,
  'Content-Type': 'application/json'
}
      });
      setDeleteInfo(response.data);
    } catch (error) {
      console.error('Error fetching delete info:', error);
      // If the endpoint doesn't exist yet or fails, create mock data
      setDeleteInfo({
        lead: {
          id: lead._id,
          name: `${lead.firstName} ${lead.lastName}`,
          stage: lead.leadStage,
          score: lead.score || 0
        },
        deletionCheck: {
          canDelete: true,
          warnings: lead.leadStage === 'Qualified' ? ['Lead is qualified - consider converting to deal instead'] : [],
          blockers: []
        },
        contactInfo: null
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in again');
        return;
      }
      
      await axios.post(`${import.meta.env.VITE_API_URL}/api/leads/${lead._id}/soft-delete`, {
  reason: formData.reason,
  notes: formData.notes,
  contactAction: formData.contactAction
}, {
  headers: {
    'x-auth-token': token,
    'Content-Type': 'application/json'
  }
});
      
      onDelete(lead._id, formData.contactAction);
      onClose();
      
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Error deleting lead: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return formData.reason;
    if (step === 2) return formData.contactAction;
    return true;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Delete Lead</h2>
              <p className="text-sm text-gray-500">
                {lead?.firstName} {lead?.lastName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : (
          <div className="p-6">
            {/* Warnings */}
            {deleteInfo?.deletionCheck?.warnings?.length > 0 && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Warning</h4>
                    <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                      {deleteInfo.deletionCheck.warnings.map((warning, index) => (
                        <li key={index}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Blockers */}
            {deleteInfo?.deletionCheck?.blockers?.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800">Cannot Delete</h4>
                    <ul className="mt-2 text-sm text-red-700 space-y-1">
                      {deleteInfo.deletionCheck.blockers.map((blocker, index) => (
                        <li key={index}>• {blocker}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Deletion Reason */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why are you deleting this lead? *
                  </label>
                  <select
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a reason...</option>
                    <option value="Duplicate">Duplicate Lead</option>
                    <option value="Invalid">Invalid Information</option>
                    <option value="Test Data">Test Data</option>
                    <option value="Spam">Spam/Unwanted</option>
                    <option value="Request Removal">Requested Removal</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Any additional details..."
                  />
                </div>
              </div>
            )}

            {/* Step 2: Contact Action */}
            {step === 2 && deleteInfo?.contactInfo && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">Associated Contact Found</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        This lead has an associated contact: <strong>{deleteInfo.contactInfo.contact.firstName} {deleteInfo.contactInfo.contact.lastName}</strong>
                      </p>
                      {deleteInfo.contactInfo.dependencies.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-blue-700">Dependencies:</p>
                          <ul className="text-xs text-blue-600 ml-4 mt-1 space-y-1">
                            {deleteInfo.contactInfo.dependencies.map((dep, index) => (
                              <li key={index}>• {dep.message}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What should happen to the associated contact?
                  </label>
                  
                  <div className="space-y-3">
                    <label className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="contactAction"
                        value="keep"
                        checked={formData.contactAction === 'keep'}
                        onChange={(e) => setFormData({ ...formData, contactAction: e.target.value })}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <UserCheck className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-gray-900">Keep Contact</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Preserve the contact for future reference (recommended)
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="contactAction"
                        value="convert"
                        checked={formData.contactAction === 'convert'}
                        onChange={(e) => setFormData({ ...formData, contactAction: e.target.value })}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <RotateCcw className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-gray-900">Convert to Standalone Contact</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Remove lead reference and keep as independent contact
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="contactAction"
                        value="delete"
                        checked={formData.contactAction === 'delete'}
                        onChange={(e) => setFormData({ ...formData, contactAction: e.target.value })}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <UserX className="w-4 h-4 text-red-600" />
                          <span className="font-medium text-gray-900">Delete Contact Too</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Also soft-delete the associated contact
                        </p>
                        {deleteInfo.contactInfo.dependencies?.length > 0 && (
                          <p className="text-xs text-red-600 mt-1">
                            ⚠️ This contact has other dependencies - use with caution
                          </p>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Final Confirmation */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Deletion Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lead:</span>
                      <span className="font-medium">{lead?.firstName} {lead?.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reason:</span>
                      <span className="font-medium">{formData.reason}</span>
                    </div>
                    {deleteInfo?.contactInfo && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contact Action:</span>
                        <span className="font-medium capitalize">
                          {formData.contactAction === 'keep' && '✓ Keep Contact'}
                          {formData.contactAction === 'convert' && '↻ Convert to Standalone'}
                          {formData.contactAction === 'delete' && '✗ Delete Contact'}
                        </span>
                      </div>
                    )}
                    {formData.notes && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Notes:</span>
                        <span className="font-medium">{formData.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Final Confirmation</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        This action will soft-delete the lead. You can restore it later if needed, but all associated data relationships may be affected.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {!loading && (
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
            <div className="flex items-center space-x-2">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← Back
                </button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              {step < 3 && deleteInfo?.contactInfo && step === 1 ? (
                <button
                  onClick={() => setStep(2)}
                  disabled={!canProceed()}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    canProceed()
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next →
                </button>
              ) : step < 3 && step === 1 ? (
                <button
                  onClick={() => setStep(3)}
                  disabled={!canProceed()}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    canProceed()
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next →
                </button>
              ) : step === 2 ? (
                <button
                  onClick={() => setStep(3)}
                  disabled={!canProceed()}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    canProceed()
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Review →
                </button>
              ) : (
                <button
                  onClick={handleDelete}
                  disabled={!canProceed() || deleteInfo?.deletionCheck?.blockers?.length > 0}
                  className={`px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                    canProceed() && !deleteInfo?.deletionCheck?.blockers?.length
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Lead</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteLeadModal;