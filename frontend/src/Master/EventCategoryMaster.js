import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API from '../utils/api';
import {
  mainContainer,
  inputFieldStyle,
  accountMainContainer,
  accountTitleSection,
  accountMainTitle,
  accountFormCard,
  accountPrimaryBtn,
  artistActionBtnEditClass,
  artistActionBtnDeleteClass,
  accountFooterInner,
  accountSecondaryBtn
} from '../styles/MasterCSSClass';

const EventCategoryMaster = () => {
  const [masterCategories, setMasterCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [subCategories, setSubCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingCategoriesData, setExistingCategoriesData] = useState([]);
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState(null);
  const [showListModal, setShowListModal] = useState(false);

  // Fetch all saved categories from backend on component mount
  useEffect(() => {
    fetchMasterCategories();
    fetchAllSavedCategories();
  }, []);

  const fetchMasterCategories = async () => {
    try {
      const response = await API.get('/categories?status=ACTIVE');
      setMasterCategories(response?.data || []);
    } catch (error) {
      console.error('Error fetching master categories:', error);
      setMasterCategories([]);
    }
  };

  const fetchAllSavedCategories = async () => {
    try {
      const response = await API.get('/event-categories/');
      
      // Unpack based on your backend structure: { success: true, data: [...] }
      let categoriesArray = [];
      if (Array.isArray(response)) {
        categoriesArray = response;
      } else if (response && Array.isArray(response.data)) {
        categoriesArray = response.data;
      } else if (response && response.data && Array.isArray(response.data.data)) {
        categoriesArray = response.data.data;
      }

      setExistingCategoriesData(categoriesArray);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setExistingCategoriesData([]);
    }
  };

// Handle dropdown selection: ONLY sets the category name. Does NOT auto-fetch or prefill.
  const handleCategorySelectChange = (e) => {
    const chosenName = e.target.value;
    setSelectedCategoryName(chosenName);

    // Reset editing state so it treats this dropdown selection as a brand new entry attempt
    setIsEditingExisting(false);
    const selected = masterCategories.find((cat) => cat.categoryId === chosenName);
    setSelectedCategoryId(selected?.categoryId || '');
    setSelectedCategoryName(selected?.categoryName || '');
    setCurrentRecordId(null);
    setSubCategories([]);
    setStatus('ACTIVE');
  };

  // Stage 2: Add Subcategory
  const handleAddSubCategory = () => {
    setSubCategories([
      ...subCategories,
      { name: '', isActive: true, isEditing: true, eventTypes: [] }
    ]);
  };

  // Stage 3: Add Event Type under a specific Subcategory
  const handleAddEventType = (subIndex) => {
    const updated = [...subCategories];
    updated[subIndex].eventTypes.push({ name: '', isActive: true, isEditing: true });
    setSubCategories(updated);
  };

const handleSubmitAll = async (e) => {
    e.preventDefault();
    if (!selectedCategoryId || !selectedCategoryName.trim()) {
      // Use a unique ID so clicking multiple times doesn't stack duplicate toasts
      return toast.error('Please select a Category Name from the dropdown.', { id: 'category-error' });
    }

    if (isSubmitting) return; // Prevent multiple simultaneous submissions

    setIsSubmitting(true);
    try {
      const payload = {
        recordId: currentRecordId,
        categoryId: selectedCategoryId,
        categoryName: selectedCategoryName,
        status,
        subCategories
      };

      await API.post('/event-categories/create-full', payload);
      
      // Give it a unique ID ('category-success') so it replaces any existing success toast
      toast.success(
        isEditingExisting ? 'Category updated successfully!' : 'New category hierarchy saved successfully!',
        { id: 'category-success' }
      );

      fetchAllSavedCategories();
      setSelectedCategoryName('');
      setSelectedCategoryId('');
      setSubCategories([]);
      setIsEditingExisting(false);
      setCurrentRecordId(null);
    } catch (error) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Already exist this category.';
      
      // Give error a unique ID ('category-error') to prevent stacking multiple duplicate popups
      toast.error(errorMessage, { id: 'category-error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrefillEdit = (item) => {
    setSelectedCategoryId(item.categoryId || '');
    setSelectedCategoryName(item.categoryName);
    setStatus(item.status || 'ACTIVE');
    setCurrentRecordId(item._id);
    setIsEditingExisting(true);
    
    const mappedSubs = (item.subCategories || []).map((sub) => ({
      name: sub.subCategoryName || '',
      isActive: sub.isActive !== undefined ? sub.isActive : true,
      isEditing: false,
      eventTypes: (sub.eventTypes || []).map((type) => ({
        name: type.typeName || '',
        isActive: type.isActive !== undefined ? type.isActive : true,
        isEditing: false
      }))
    }));
    setSubCategories(mappedSubs);
    setShowListModal(false);
    toast.success(`Loaded "${item.categoryName}" for editing.`, { id: 'category-success' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category hierarchy?')) return;
    try {
      await API.delete(`/event-categories/${id}`);
      toast.success('Category hierarchy deleted successfully!', { id: 'category-success' });
      fetchAllSavedCategories();
    } catch (error) {
      toast.error(error.message || 'Delete failed.', { id: 'category-error' });
    }
  };
  return (
    <div className={mainContainer}>
      <main className={accountMainContainer}>
        
        {/* Title Section with List Button */}
        <div className={accountTitleSection}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className={accountMainTitle}>Service Category Master</h1>
              
            </div>
            <button
              type="button"
              onClick={() => setShowListModal(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>View List ({existingCategoriesData.length})</span>
            </button>
          </div>
        </div>

        <div className={accountFormCard}>
          <form onSubmit={handleSubmitAll} className="space-y-6">
            
            {/* STAGE 1: CATEGORY REGISTRATION DROPDOWN */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase border-b pb-2 flex justify-between items-center">
                <span>1. Category Registration</span>
                {isEditingExisting && (
                  <span className="text-blue-600 font-semibold lowercase text-[11px] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Category already exists 
                  </span>
                )}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6">
               <div className="sm:col-span-8">
                  <label className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider mb-1">Category Name</label>
                  <select
                    value={selectedCategoryId}
                    onChange={handleCategorySelectChange}
                    disabled={isEditingExisting}
                    className={`${inputFieldStyle} border-2 font-semibold bg-white cursor-pointer`}
                  >
                    <option value="">-- Select Category from Dropdown --</option>
                    {masterCategories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-4">
                  <label className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className={`${inputFieldStyle} border-2 font-semibold`}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>
            </div>

            {/* MANAGE STAGE 2 & STAGE 3 */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Manage Sub-Categories & Event Types</h4>
                <button
                  type="button"
                  onClick={handleAddSubCategory}
                  className="w-full sm:w-auto px-3.5 py-2 sm:py-1 bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>+ Add Sub-Category</span>
                </button>
              </div>

              {/* Tree Container */}
              <div className="p-3 sm:p-4 bg-slate-50/60 rounded-xl border border-slate-200 space-y-4 min-h-[160px] overflow-x-auto">
                {subCategories.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-6">
                    {selectedCategoryName ? 'No sub-categories added for this category yet. Click "+ Add Sub-Category" above.' : 'Please select a category from the dropdown above first.'}
                  </p>
                ) : (
                  subCategories.map((subCat, subIndex) => (
                    <div key={subIndex} className="p-3 sm:p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3 min-w-[280px]">
                      
                      {/* STAGE 2: SUBCATEGORY ROW */}
                      <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                        <div className="flex items-center gap-2.5 flex-1 min-w-[200px]">
                          <input
                            type="checkbox"
                            checked={subCat.isActive}
                            onChange={(e) => {
                              const updated = [...subCategories];
                              updated[subIndex].isActive = e.target.checked;
                              setSubCategories(updated);
                            }}
                            className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600 shrink-0"
                          />

                          {subCat.isEditing ? (
                            <div className="flex items-center gap-1 w-full max-w-xs">
                              <input
                                type="text"
                                value={subCat.name}
                                onChange={(e) => {
                                  const updated = [...subCategories];
                                  updated[subIndex].name = e.target.value;
                                  setSubCategories(updated);
                                }}
                                className={`${inputFieldStyle} border-2 text-xs py-1 font-semibold w-full`}
                                placeholder="Sub-category name"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (!subCat.name.trim()) return toast.error('Name cannot be empty');
                                  const updated = [...subCategories];
                                  updated[subIndex].isEditing = false;
                                  setSubCategories(updated);
                                  toast.success('Subcategory saved');
                                }}
                                className="text-emerald-600 font-bold px-1.5 text-sm shrink-0 cursor-pointer"
                                title="Save"
                              >
                                ✓
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-800">{subCat.name}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...subCategories];
                                  updated[subIndex].isEditing = true;
                                  setSubCategories(updated);
                                }}
                                className="text-blue-500 hover:text-blue-700 text-xs shrink-0 cursor-pointer"
                                title="Edit Sub-Category"
                              >
                                ✏️
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = subCategories.filter((_, idx) => idx !== subIndex);
                              setSubCategories(updated);
                            }}
                            className="text-red-400 hover:text-red-600 text-xs p-1 cursor-pointer"
                            title="Delete Sub-Category"
                          >
                            🗑️
                          </button>

                          <button
                            type="button"
                            onClick={() => handleAddEventType(subIndex)}
                            className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center hover:bg-blue-600 shadow-2xs transition shrink-0 cursor-pointer"
                            title="Add Event Type"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* STAGE 3: EVENT TYPES LIST */}
                      <div className="pl-4 sm:pl-8 space-y-2 pt-2 border-l-2 border-slate-100 ml-1 sm:ml-2">
                        {subCat.eventTypes?.map((eventType, typeIndex) => (
                          <div key={typeIndex} className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5 flex-1">
                              <input
                                type="checkbox"
                                checked={eventType.isActive}
                                onChange={(e) => {
                                  const updated = [...subCategories];
                                  updated[subIndex].eventTypes[typeIndex].isActive = e.target.checked;
                                  setSubCategories(updated);
                                }}
                                className="w-3.5 h-3.5 text-blue-600 rounded cursor-pointer accent-blue-600 shrink-0"
                              />

                              {eventType.isEditing ? (
                                <div className="flex items-center gap-1 w-full max-w-xs">
                                  <input
                                    type="text"
                                    value={eventType.name}
                                    onChange={(e) => {
                                      const updated = [...subCategories];
                                      updated[subIndex].eventTypes[typeIndex].name = e.target.value;
                                      setSubCategories(updated);
                                    }}
                                    className={`${inputFieldStyle} border-2 text-xs py-1 w-full bg-slate-50`}
                                    placeholder="Event type name"
                                    autoFocus
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!eventType.name.trim()) return toast.error('Name cannot be empty');
                                      const updated = [...subCategories];
                                      updated[subIndex].eventTypes[typeIndex].isEditing = false;
                                      setSubCategories(updated);
                                      toast.success('Event type saved');
                                    }}
                                    className="text-emerald-600 font-bold px-1.5 text-sm shrink-0 cursor-pointer"
                                    title="Save"
                                  >
                                    ✓
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-700 font-medium">
                                    🏷️ {eventType.name}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...subCategories];
                                      updated[subIndex].eventTypes[typeIndex].isEditing = true;
                                      setSubCategories(updated);
                                    }}
                                    className="text-blue-500 hover:text-blue-700 text-xs shrink-0 cursor-pointer"
                                    title="Edit Event Type"
                                  >
                                    ✏️
                                  </button>
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...subCategories];
                                updated[subIndex].eventTypes.splice(typeIndex, 1);
                                setSubCategories(updated);
                              }}
                              className="text-red-400 hover:text-red-600 text-xs p-1 shrink-0 cursor-pointer"
                              title="Delete Event Type"
                            >
                              🗑️
                            </button>
                          </div>
                        ))}
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>

      <footer className="bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 z-40 shadow-lg w-full h-14 flex items-center">
              <div className={accountFooterInner}>
                <button 
                  type="button" 
                  onClick={() => setShowListModal(true)} 
                  className={accountSecondaryBtn}
                >
                  Back List
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting || !selectedCategoryName} 
                  className={accountPrimaryBtn}
                >
                  {isSubmitting ? 'Saving...' : isEditingExisting ? 'Update Category Hierarchy' : 'Save Category Hierarchy'}
                </button>
              </div>
            </footer>

            
          </form>
        </div>

{/* LIST MODAL POPUP SHOWING ALL SAVED CATEGORIES IN A COMPACT TABLE */}
        {showListModal && (
          <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-4 max-h-[80vh] overflow-y-auto shadow-xl">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Saved Categories Directory ({existingCategoriesData.length})
                </h3>
                <button 
                  type="button" 
                  onClick={() => setShowListModal(false)}
                  className="text-slate-500 hover:text-slate-800 font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="overflow-x-auto">
                {existingCategoriesData.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No categories saved to database yet.</p>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-y border-slate-200 text-slate-700">
                        <th className="py-2.5 px-3 font-bold uppercase tracking-wider w-1/4">Sl</th>
                        <th className="py-2.5 px-3 font-bold uppercase tracking-wider w-1/4">Category</th>
                        <th className="py-2.5 px-3 font-bold uppercase tracking-wider w-1/3">Subcategories & Event Types</th>
                        <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Status</th>

       
                        <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right w-1/6">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {existingCategoriesData.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80">
                          {/* Category Name */}
                             <td className="py-3 px-3 font-semibold text-slate-600 align-top">
                            {idx+1}
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-900 align-top">
                            {item.categoryName}
                          </td>
                         

                          {/* Compact Subcategories & Event Types Summary */}
                          <td className="py-3 px-3 text-slate-700 align-top">
                            {(!item.subCategories || item.subCategories.length === 0) ? (
                              <span className="text-slate-400 italic">No subcategories</span>
                            ) : (
                              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                                {item.subCategories.map((sub, sIdx) => (
                                  <div key={sIdx} className="bg-slate-100/70 p-1.5 rounded border border-slate-200/60 text-[11px]">
                                    <span className="font-semibold text-sm text-slate-900 block">{sub.subCategoryName}</span>
                                    <span className="text-slate-600 block text-[14px] mt-0.5">
                                      {sub.eventTypes && sub.eventTypes.length > 0 
                                        ? sub.eventTypes.map(t => t.typeName).join(', ') 
                                        : <span className="text-slate-400 italic">No event types</span>}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>

                         <td className="py-2 px-2">
                          <span className={item.status === 'ACTIVE' ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold' : 'text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[10px] font-bold'}>
                            {item.status}
                          </span>
                        </td>

                          {/* Edit Action Button */}
                          <td className="py-2 px-2 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => handlePrefillEdit(item)}
                              className={artistActionBtnEditClass}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item._id)}
                              className={artistActionBtnDeleteClass}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default EventCategoryMaster;
