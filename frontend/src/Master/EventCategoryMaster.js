import React, { useState } from 'react';
import toast from 'react-hot-toast';
import API from '../utils/api';
import {
  mainContainer,
  inputFieldStyle,
  accountMainContainer,
  accountTitleSection,
  accountMainTitle,
  accountMainSubTitle,
  accountFormCard,
  accountPrimaryBtn
} from '../styles/MasterCSSClass';

const EventCategoryMaster = () => {
  const [categoryName, setCategoryName] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [subCategories, setSubCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!categoryName.trim()) {
      return toast.error('Category Name is required.');
    }

    setIsSubmitting(true);
    try {
      const payload = {
        categoryName,
        status,
        subCategories
      };

      await API.post('/event-categories/create-full', payload);
      toast.success('3-Stage Category Hierarchy saved successfully to database!');
      setCategoryName('');
      setSubCategories([]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save to database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={mainContainer}>
      <main className={accountMainContainer}>
        <div className={accountTitleSection}>
          <h1 className={accountMainTitle}>Service Category Master</h1>
          <p className={accountMainSubTitle}>DEFINE HIERARCHICAL SERVICE CATEGORIZATION (3-STAGE MODEL)</p>
        </div>

        <div className={accountFormCard}>
          <form onSubmit={handleSubmitAll} className="space-y-6">
            
            {/* STAGE 1: CATEGORY REGISTRATION */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase border-b pb-2">1. Category Registration</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6">
                <div className="sm:col-span-8">
                  <label className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider mb-1">Category Name</label>
                  <input
                    type="text"
                    placeholder="Enter category name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className={`${inputFieldStyle} border-2 font-semibold`}
                  />
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
                  className="w-full sm:w-auto px-3.5 py-2 sm:py-1 bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center justify-center gap-1"
                >
                  <span>+ Add Sub-Category (Stage 2)</span>
                </button>
              </div>

              {/* Tree Container */}
              <div className="p-3 sm:p-4 bg-slate-50/60 rounded-xl border border-slate-200 space-y-4 min-h-[160px] overflow-x-auto">
                {subCategories.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-6">No sub-categories added yet. Click "+ Add Sub-Category (Stage 2)" above.</p>
                ) : (
                  subCategories.map((subCat, subIndex) => {
                    return (
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
                                  className="text-emerald-600 font-bold px-1.5 text-sm shrink-0"
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
                                  className="text-blue-500 hover:text-blue-700 text-xs shrink-0"
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
                              className="text-red-400 hover:text-red-600 text-xs p-1"
                              title="Delete Sub-Category"
                            >
                              🗑️
                            </button>

                            <button
                              type="button"
                              onClick={() => handleAddEventType(subIndex)}
                              className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center hover:bg-blue-600 shadow-2xs transition shrink-0"
                              title="Add Event Type (Final Stage)"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* STAGE 3: EVENT TYPES LIST */}
                        <div className="pl-4 sm:pl-8 space-y-2 pt-2 border-l-2 border-slate-100 ml-1 sm:ml-2">
                          {subCat.eventTypes?.map((eventType, typeIndex) => {
                            return (
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
                                        className="text-emerald-600 font-bold px-1.5 text-sm shrink-0"
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
                                        className="text-blue-500 hover:text-blue-700 text-xs shrink-0"
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
                                  className="text-red-400 hover:text-red-600 text-xs p-1 shrink-0"
                                  title="Delete Event Type"
                                >
                                  🗑️
                                </button>
                              </div>
                            );
                          })}
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* FINAL SUBMIT BUTTON AT THE BOTTOM */}
            <div className="pt-6 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={accountPrimaryBtn + " w-full sm:w-auto px-8 py-3 text-sm"}
              >
                {isSubmitting ? 'Saving to Database...' : 'Submit Category & Sub-Categories'}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
};

export default EventCategoryMaster;