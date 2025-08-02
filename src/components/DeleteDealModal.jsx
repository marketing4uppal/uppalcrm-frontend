// src/components/DeleteDealModal.jsx
import React, { useState, useEffect } from 'react';
import { 
  X, 
  AlertTriangle, 
  Info, 
  Trash2, 
  Shield,
  DollarSign,
  Calendar,
  Briefcase
} from 'lucide-react';
import axios from 'axios';

const DeleteDealModal = ({ deal, isOpen, onClose, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState(null);
  const [formData, setFormData] = useState({
    reason: '',
    notes: ''
  });
  const [step, setStep] = useState(1); // 1: confirm, 2: final confirm

  useEffect(() => {
    if (isOpen && deal) {
      fetchDeleteInfo();
      // Reset form when modal opens
      setFormData({
        reason: '',
        notes: ''
      });
      setStep(1);
    }
  }, [isOpen, deal]);

  const fetchDeleteInfo = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/deals/${deal._id}/delete-info`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setDeleteInfo(response.data);
    } catch (error) {
      console.error('Error fetching deal delete info:', error);
      // Create fallback data if endpoint fails
      setDeleteInfo({
        deal: {
          id: deal._id,
          name: deal.dealName || `${deal.firstName} ${deal.lastName}`,
          stage: deal.stage,
          amount: deal.amount
        },
        deletionCheck: {
          canDelete: true,
          warnings: [],
          blockers: [],
          dependencies: []
        }
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
      
      await axios.post(`${import.meta.env.VITE_API_URL}/api/deals/${deal._id}/soft-delete`, {
        reason: formData.reason,
        notes: formData.notes
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      onDelete(deal._id);
      onClose();
      
    } catch (error) {
      console.error('Error deleting deal:', error);
      alert('Error deleting deal: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return formData.reason;
    return true;
  };

  const getDependencyIcon = (type) => {
    switch (type) {
      case 'account': return <Briefcase className="w-4 h-4 text-purple-600" />;
      default: return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
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
              <h2 className="text-xl font-semibold text-gray-900">Delete Deal</h2>
              <p className="text-sm text-gray-500">
                {deal?.dealName || `${deal?.firstName} ${deal?.lastName}`}
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
            {/* Deal Summary */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Deal Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">{formatCurrency(deal?.amount)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-600">Stage:</span>
                  <span className="font-medium">{deal?.stage}</span>
                </div>
              </div>
            </div>

            {/* Dependencies Warning */}
            {deleteInfo?.deletionCheck?.dependencies?.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-red-800">Cannot Delete - Active Dependencies</h4>
                    <p className="text-sm text-red-700 mt-1">
                      This deal has active relationships that prevent deletion:
                    </p>
                    <ul className="mt-3 space-y-2">
                      {deleteInfo.deletionCheck.dependencies.map((dep, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm text-red-700">
                          {getDependencyIcon(dep.type)}
                          <span>{dep.message}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 p-3 bg-red-100 rounded-lg">
                      <p className="text-sm text-red-800 font-medium">What you can do:</p>
                      <ul className="text-xs text-red-700 mt-1 space-y-1">
                        <li>• Close or transfer associated accounts first</li>
                        <li>• Contact admin to resolve dependencies</li>
                      </ul>
                    </div>
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

            {/* Only show deletion form if deal can be deleted */}
            {deleteInfo?.deletionCheck?.canDelete && deleteInfo?.deletionCheck?.dependencies?.length === 0 && (
              <>
                {/* Step 1: Deletion Reason */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Why are you deleting this deal? *
                      </label>
                      <select
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select a reason...</option>
                        <option value="Duplicate">Duplicate Deal</option>
                        <option value="Invalid">Invalid Information</option>
                        <option value="Test Data">Test Data</option>
                        <option value="Lost Opportunity">Lost Opportunity</option>
                        <option value="Cancelled">Cancelled by Client</option>
                        <option value="No Longer Relevant">No Longer Relevant</option>
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

                {/* Step 2: Final Confirmation */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">Deletion Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Deal:</span>
                          <span className="font-medium">{deal?.dealName || `${deal?.firstName} ${deal?.lastName}`}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-medium">{formatCurrency(deal?.amount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Stage:</span>
                          <span className="font-medium">{deal?.stage}</span>
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
                            This action will soft-delete the deal. You can restore it later if needed.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Footer */}
        {!loading && (
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
            <div className="flex items-center space-x-2">
              {step > 1 && deleteInfo?.deletionCheck?.canDelete && deleteInfo?.deletionCheck?.dependencies?.length === 0 && (
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
                {!deleteInfo?.deletionCheck?.canDelete || deleteInfo?.deletionCheck?.dependencies?.length > 0 ? 'Close' : 'Cancel'}
              </button>
              
              {deleteInfo?.deletionCheck?.canDelete && deleteInfo?.deletionCheck?.dependencies?.length === 0 && (
                <>
                  {step === 1 ? (
                    <button
                      onClick={() => setStep(2)}
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
                      disabled={!canProceed()}
                      className={`px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                        canProceed()
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Deal</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteDealModal;