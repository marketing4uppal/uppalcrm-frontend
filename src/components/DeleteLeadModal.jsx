// src/components/DeleteLeadModal.jsx (TEMPORARY - Works with current backend)
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
  const [formData, setFormData] = useState({
    reason: '',
    notes: '',
    contactAction: 'keep'
  });
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (isOpen && lead) {
      // Reset form when modal opens
      setFormData({
        reason: '',
        notes: '',
        contactAction: 'keep'
      });
      setStep(1);
    }
  }, [isOpen, lead]);

  const handleDelete = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in again');
        return;
      }

      // TEMPORARY: Use regular DELETE method since soft-delete endpoints aren't deployed yet
      const confirmed = window.confirm('⚠️ TEMPORARY: This will permanently delete the lead until soft-delete backend is deployed. Continue?');
      if (!confirmed) {
        setLoading(false);
        return;
      }

      // For now, just remove from frontend and show success
      // In the future, this will call the soft-delete API
      console.log('TEMP: Would soft-delete lead:', {
        leadId: lead._id,
        reason: formData.reason,
        notes: formData.notes,
        contactAction: formData.contactAction
      });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
            <p className="mt-4 text-gray-600">Processing...</p>
          </div>
        ) : (
          <div className="p-6">
            {/* TEMPORARY WARNING */}
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-800">Temporary Mode</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Backend soft-delete is not deployed yet. This will remove the lead from your view temporarily. 
                    Full soft-delete functionality will be available after backend deployment.
                  </p>
                </div>
              </div>
            </div>

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

            {/* Step 2: Contact Action (Simplified for temp) */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">Contact Handling</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        For now, contacts will be preserved. Full contact management will be available after backend deployment.
                      </p>
                    </div>
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
                        This action will remove the lead from your current view. Full soft-delete with restore capability will be available after backend deployment.
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
              
              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    canProceed()
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleDelete}
                  disabled={!canProceed()}
                  className="px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 bg-red-600 text-white hover:bg-red-700"
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