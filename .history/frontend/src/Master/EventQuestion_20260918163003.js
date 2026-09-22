import React, { useEffect, useMemo,useRef, useState } from 'react';
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
  accountFooterInner,
  accountSecondaryBtn,
  accountPrimaryBtn,
  artistTableHeadStyle,
  artistTableRowStyle,
  artistActionBtnEditClass,
  artistActionBtnDeleteClass
} from '../styles/MasterCSSClass';

const emptyForm = {
  eventCategoryId: '',
  eventCategoryName: '',
  subCategories: [],
  eventTypes: [],
  questionIds: [],
  showQuestionDetails: false,
  status: 'ACTIVE'
};

const getPayloadArray = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
};

const optionText = (question) => (
  [question.optionA, question.optionB, question.optionC, question.optionD, question.optionE]
    .filter(Boolean)
    .join(', ')
);

const MultiCheckDropdown = ({ label, placeholder, items, selectedKeys, getKey, getLabel, onToggle, disabled, isOpen, name, setActiveDropdown }) => {
  const dropdownRef = useRef(null);
  const selectedLabels = items.filter((item) => selectedKeys.includes(getKey(item))).map((item) => getLabel(item));

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        if (isOpen) {
          setActiveDropdown(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, name, setActiveDropdown]);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider mb-1">{label}</label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setActiveDropdown(isOpen ? null : name)}
        className={`${inputFieldStyle} border-2 bg-white text-left min-h-[34px] flex items-center justify-between gap-2 ${disabled ? 'bg-slate-100 cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
      >
        <span className="truncate text-xs">
          {selectedLabels.length ? selectedLabels.join(', ') : placeholder}
        </span>
        <span className="text-[10px] text-slate-500">v</span>
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
          {items.length === 0 ? (
            <div className="px-3 py-2 text-xs text-slate-400">No options found.</div>
          ) : items.map((item) => {
            const key = getKey(item);
            return (
              <label key={key} className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedKeys.includes(key)}
                  onChange={() => onToggle(item)}
                  className="w-3.5 h-3.5 accent-blue-600"
                />
                <span className="truncate">{getLabel(item)}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};
const EventQuestion = () => {
  const [formData, setFormData] = useState(emptyForm);
  const [eventCategories, setEventCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [records, setRecords] = useState([]);
  const [editId, setEditId] = useState(null);
  const [viewMode, setViewMode] = useState('form');
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    fetchMasters();
    fetchRecords();
  }, []);

const fetchMasters = async () => {
    try {
      const [categoryRes, questionRes] = await Promise.all([
        API.get('/event-categories'),
        API.get('/question-database')
      ]);
      setEventCategories(getPayloadArray(categoryRes).filter((cat) => cat.status === 'ACTIVE'));
      
      // Sort questions in ascending order based on questionId (e.g., QD1, QD2, QD10...)
      const sortedQuestions = getPayloadArray(questionRes).sort((a, b) => {
        const numA = parseInt((a.questionId || '').replace(/\D/g, ''), 10) || 0;
        const numB = parseInt((b.questionId || '').replace(/\D/g, ''), 10) || 0;
        return numA - numB;
      });
      setQuestions(sortedQuestions);
    } catch {
      toast.error('Failed to load event questions master data.', { id: 'event-question-toast' });
    }
  };

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await API.get('/event-questions');
      setRecords(getPayloadArray(res));
    } catch {
      toast.error('Failed to load event question mappings.', { id: 'event-question-toast' });
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = useMemo(
    () => eventCategories.find((cat) => cat.categoryId === formData.eventCategoryId),
    [eventCategories, formData.eventCategoryId]
  );

  const availableSubCategories = useMemo(
    () => (selectedCategory?.subCategories || []).filter((sub) => sub.isActive !== false),
    [selectedCategory]
  );

  const availableEventTypes = useMemo(() => {
    const selectedSubIds = formData.subCategories.map((sub) => sub.subCategoryId || sub.subCategoryName);
    return availableSubCategories
      .filter((sub) => selectedSubIds.includes(sub._id || sub.subCategoryName))
      .flatMap((sub) => (sub.eventTypes || [])
        .filter((type) => type.isActive !== false)
        .map((type) => ({
          ...type,
          subCategoryId: sub._id || sub.subCategoryName,
          subCategoryName: sub.subCategoryName
        })));
  }, [availableSubCategories, formData.subCategories]);

  const selectedQuestions = useMemo(
    () => questions.filter((question) => formData.questionIds.includes(question.questionId)),
    [questions, formData.questionIds]
  );

  const resetForm = () => {
    setFormData(emptyForm);
    setEditId(null);
  };

  const handleCategoryChange = (e) => {
    const category = eventCategories.find((cat) => cat.categoryId === e.target.value);
    setFormData({
      ...emptyForm,
      eventCategoryId: category?.categoryId || '',
      eventCategoryName: category?.categoryName || '',
      status: formData.status
    });
  };

  const toggleSubCategory = (sub) => {
    const key = sub._id || sub.subCategoryName;
    const exists = formData.subCategories.some((item) => (item.subCategoryId || item.subCategoryName) === key);
    const subCategories = exists
      ? formData.subCategories.filter((item) => (item.subCategoryId || item.subCategoryName) !== key)
      : [...formData.subCategories, { subCategoryId: key, subCategoryName: sub.subCategoryName }];
    const subKeys = subCategories.map((item) => item.subCategoryId || item.subCategoryName);

    setFormData({
      ...formData,
      subCategories,
      eventTypes: formData.eventTypes.filter((type) => subKeys.includes(type.subCategoryId || type.subCategoryName))
    });
  };

  const toggleEventType = (type) => {
    const key = `${type.subCategoryId}-${type._id || type.typeName}`;
    const exists = formData.eventTypes.some((item) => `${item.subCategoryId}-${item.eventTypeId || item.typeName}` === key);
    const eventTypes = exists
      ? formData.eventTypes.filter((item) => `${item.subCategoryId}-${item.eventTypeId || item.typeName}` !== key)
      : [...formData.eventTypes, {
        eventTypeId: type._id || type.typeName,
        typeName: type.typeName,
        subCategoryId: type.subCategoryId,
        subCategoryName: type.subCategoryName
      }];
    setFormData({ ...formData, eventTypes });
  };

  const toggleQuestion = (question) => {
    const exists = formData.questionIds.includes(question.questionId);
    setFormData({
      ...formData,
      questionIds: exists
        ? formData.questionIds.filter((id) => id !== question.questionId)
        : [...formData.questionIds, question.questionId]
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!formData.eventCategoryId) return toast.error('Please select event category.', { id: 'event-question-toast' });
  //   if (!formData.questionIds.length) return toast.error('Please select at least one question.', { id: 'event-question-toast' });

  //   setIsSaving(true);
  //   try {
  //     if (editId) {
  //       await API.put(`/event-questions/${editId}`, formData);
  //       toast.success('Event question updated successfully.', { id: 'event-question-toast' });
  //     } else {
  //       await API.post('/event-questions', formData);
  //       toast.success('Event question saved successfully.', { id: 'event-question-toast' });
  //     }
  //     resetForm();
  //     fetchRecords();
  //   } catch (error) {
  //     toast.error(error.message || 'Save failed.', { id: 'event-question-toast' });
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.eventCategoryId) return toast.error('Please select event category.', { id: 'event-question-toast' });
    if (!formData.questionIds.length) return toast.error('Please select at least one question.', { id: 'event-question-toast' });

    const isDuplicate = records.some((rec) => {
      if (editId && rec._id === editId) return false;
      const sameCategory = rec.eventCategoryId === formData.eventCategoryId;
      const recSubIds = (rec.subCategories || []).map(s => s.subCategoryId || s.subCategoryName).sort().join(',');
      const formSubIds = formData.subCategories.map(s => s.subCategoryId || s.subCategoryName).sort().join(',');
      const recTypeIds = (rec.eventTypes || []).map(t => t.eventTypeId || t.typeName).sort().join(',');
      const formTypeIds = formData.eventTypes.map(t => t.eventTypeId || t.typeName).sort().join(',');
      return sameCategory && recSubIds === formSubIds && recTypeIds === formTypeIds;
    });

    if (isDuplicate) {
      return toast.error('This combination of Category, Sub-Category, and Event Type already exists.', { id: 'event-question-toast' });
    }

    setIsSaving(true);
    try {
      if (editId) {
        await API.put(`/event-questions/${editId}`, formData);
        toast.success('Event question updated successfully.', { id: 'event-question-toast' });
      } else {
        await API.post('/event-questions', formData);
        toast.success('Event question saved successfully.', { id: 'event-question-toast' });
      }
      resetForm();
      fetchRecords();
    } catch (error) {
      toast.error(error.message || 'Save failed.', { id: 'event-question-toast' });
    } finally {
      setIsSaving(false);
    }
  };
  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      eventCategoryId: item.eventCategoryId || '',
      eventCategoryName: item.eventCategoryName || '',
      subCategories: item.subCategories || [],
      eventTypes: item.eventTypes || [],
      questionIds: item.questionIds || [],
      showQuestionDetails: Boolean(item.showQuestionDetails),
      status: item.status || 'ACTIVE'
    });
    setViewMode('form');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event question mapping?')) return;
    try {
      await API.delete(`/event-questions/${id}`);
      toast.success('Event question deleted successfully.', { id: 'event-question-toast' });
      fetchRecords();
    } catch (error) {
      toast.error(error.message || 'Delete failed.', { id: 'event-question-toast' });
    }
  };

  return (
      <div className={mainContainer}>
          <main className={accountMainContainer}>
            <div className={accountTitleSection}>
              <h1 className={accountMainTitle}>Event Question Master</h1>
         
        </div>

        <div className={accountFormCard + " flex-1 flex flex-col pb-16"}>
          {viewMode === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-sm font-bold text-slate-800">{editId ? 'Edit Event Question' : 'Add Event Question'}</h2>
                <button type="button" onClick={() => setViewMode('list')} className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-1.5 rounded-md transition cursor-pointer border border-slate-200 shadow-xs">
                  View List ({records.length})
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider mb-1">Event Category</label>
                  <select value={formData.eventCategoryId} onChange={handleCategoryChange} className={`${inputFieldStyle} border-2 bg-white`}>
                    <option value="">Select event category</option>
                    {eventCategories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                    ))}
                  </select>
                </div>

               

              <MultiCheckDropdown
                  label="Subcategory"
                  placeholder={!formData.eventCategoryId ? 'First select event category' : 'Select subcategory'}
                  disabled={!formData.eventCategoryId}
                  items={availableSubCategories}
                  selectedKeys={formData.subCategories.map((item) => item.subCategoryId || item.subCategoryName)}
                  getKey={(item) => item._id || item.subCategoryName}
                  getLabel={(item) => item.subCategoryName}
                  onToggle={toggleSubCategory}
                  isOpen={activeDropdown === 'subCategory'}
                  name="subCategory"
                  setActiveDropdown={setActiveDropdown}
                />

                <MultiCheckDropdown
                  label="Event Type"
                  placeholder={!formData.subCategories.length ? 'First select subcategory' : 'Select event type'}
                  disabled={!formData.subCategories.length}
                  items={availableEventTypes}
                  selectedKeys={formData.eventTypes.map((item) => `${item.subCategoryId}-${item.eventTypeId || item.typeName}`)}
                  getKey={(item) => `${item.subCategoryId}-${item._id || item.typeName}`}
                  getLabel={(item) => `${item.typeName}`}
                  onToggle={toggleEventType}
                  isOpen={activeDropdown === 'eventType'}
                  name="eventType"
                  setActiveDropdown={setActiveDropdown}
                />
  </div>
   <div>
                  <label className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider mb-1">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={`${inputFieldStyle} border-2 bg-white`}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <MultiCheckDropdown
                    label="Questions"
                    placeholder="Select questions"
                    items={questions}
                    selectedKeys={formData.questionIds}
                    getKey={(item) => item.questionId}
                    getLabel={(item) => `${item.questionId} - ${item.question}`}
                    onToggle={toggleQuestion}
                    isOpen={activeDropdown === 'questions'}
                    name="questions"
                    setActiveDropdown={setActiveDropdown}
                  />
                </div>
            

              <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showQuestionDetails}
                  onChange={(e) => setFormData({ ...formData, showQuestionDetails: e.target.checked })}
                  className="w-4 h-4 accent-blue-600"
                />
                Show selected question details
              </label>

              {formData.showQuestionDetails && (
                <div className="border border-slate-200 rounded-lg bg-slate-50 p-3 space-y-2 max-h-64 overflow-y-auto">
                  {selectedQuestions.length === 0 ? (
                    <p className="text-xs text-slate-400">Select questions to preview details.</p>
                  ) : selectedQuestions.map((question) => (
                    <div key={question.questionId} className="bg-white rounded-md border border-slate-200 p-3 text-xs">
                      <div className="font-bold text-slate-900">{question.questionId} - {question.question}</div>
                      <div className="text-slate-600 mt-1">Options: {optionText(question) || 'No options'}</div>
                      <div className="text-slate-500 mt-1">
                        Text: {[question.textA, question.textB, question.textC, question.textD, question.textE].filter(Boolean).join(', ') || 'No text'}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <footer className="bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 z-40 shadow-lg w-full h-14 flex items-center">
                <div className={accountFooterInner}>
                  <button type="button" onClick={() => { resetForm(); setViewMode('list'); }} className={accountSecondaryBtn}>Back to List</button>
                  <button disabled={isSaving} type="submit" className={accountPrimaryBtn}>{isSaving ? 'Saving...' : editId ? 'Update Event Question' : 'Save Event Question'}</button>
                </div>
              </footer>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-500">Total Event Questions: {records.length}</span>
                <button type="button" onClick={() => { resetForm(); setViewMode('form'); }} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-md transition cursor-pointer border border-blue-600 shadow-xs">+ New Add</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className={artistTableHeadStyle}>
                      <th className="py-2 px-2">sl</th>
                      <th className="py-2 px-2">CATEGORY</th>
                      <th className="py-2 px-2">SUBCATEGORY</th>
                      <th className="py-2 px-2">EVENT TYPE</th>
                      <th className="py-2 px-2">QUESTIONS</th>
                      <th className="py-2 px-2">STATUS</th>
                      <th className="py-2 px-2 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {loading ? (
                      <tr><td colSpan="7" className="text-center py-5 text-slate-400">Loading event questions...</td></tr>
                    ) : records.length === 0 ? (
                      <tr><td colSpan="7" className="text-center py-5 text-slate-400">No event questions found.</td></tr>
                    ) : records.map((item,index) => (
                      <tr key={item._id} className={artistTableRowStyle}>
                        <td className="py-2 px-2">{index+1}</td>
                        <td className="py-2 px-2 font-semibold">{item.eventCategoryName}</td>
                        <td className="py-2 px-2">{(item.subCategories || []).map((sub) => sub.subCategoryName).join(', ') || '-'}</td>
                        <td className="py-2 px-2">{(item.eventTypes || []).map((type) => type.typeName).join(', ') || '-'}</td>
                       <td className="py-2 px-2">
                        {item.questions && item.questions.length > 0 ? (
                          <div className="space-y-1">
                            {item.questions.map((q, qIdx) => (
                              <div key={qIdx} className="text-xs">
                                <span className="font-medium">{q.questionId || `QD${qIdx + 1}`}:</span> {q.question}
                              </div>
                            ))}
                          </div>
                        ) : (
                          (item.questionIds || []).join(', ')
                        )}
                      </td>
                        <td className="py-2 px-2">
                          <span className={item.status === 'ACTIVE' ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold' : 'text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[10px] font-bold'}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-right space-x-2">
                          <button type="button" onClick={() => handleEdit(item)} className={artistActionBtnEditClass}>Edit</button>
                          <button type="button" onClick={() => handleDelete(item._id)} className={artistActionBtnDeleteClass}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EventQuestion;
