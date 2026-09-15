import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import API from '../utils/api';
import {
  mainContainer,
  accountMainContainer,
  accountTitleSection,
  accountMainTitle,
  accountMainSubTitle,
  accountFormCard,
  accountFooterInner,
  accountSecondaryBtn,
  accountPrimaryBtn,
  inputFieldStyle,
  artistTableHeadStyle,
  artistTableRowStyle,
  artistActionBtnEditClass,
  artistActionBtnDeleteClass
} from '../styles/MasterCSSClass';

const emptyForm = {
  question: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  optionE: '',
  textA: '',
  textB: '',
  textC: '',
  textD: '',
  textE: ''
};

const fields = [
  ['question', 'Questions'],
  ['optionA', 'Option A'],
  ['optionB', 'Option B'],
  ['optionC', 'Option C'],
  ['optionD', 'Option D'],
  ['optionE', 'Option E'],
  ['textA', 'A Text'],
  ['textB', 'B Text'],
  ['textC', 'C Text'],
  ['textD', 'D Text'],
  ['textE', 'E Text']
];

const QuestionDatabseMaster = () => {
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [viewMode, setViewMode] = useState('form');
  const [entryMode, setEntryMode] = useState('manual');
  const [excelFile, setExcelFile] = useState(null);
  const [excelRows, setExcelRows] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await API.get('/question-database');
      setQuestions(res?.data || []);
    } catch {
      toast.error('Failed to load question database.', { id: 'question-db-toast' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditId(null);
    setExcelFile(null);
    setExcelRows([]);
    setEntryMode('manual');
  };

  const handleExcelFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExcelFile(file);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const workbook = XLSX.read(evt.target.result, { type: 'binary' });
        const ws = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws);
        setExcelRows(rows);
        toast.success(`Loaded ${rows.length} question rows.`, { id: 'question-db-toast' });
      } catch {
        toast.error('Failed to parse Excel file.', { id: 'question-db-toast' });
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (entryMode === 'excel' && !editId) {
        if (!excelRows.length) {
          toast.error('Please upload a valid Excel file first.', { id: 'question-db-toast' });
          return;
        }
        await API.post('/question-database', excelRows);
        toast.success('Excel questions uploaded successfully.', { id: 'question-db-toast' });
      } else {
        if (!formData.question.trim()) {
          toast.error('Question is required.', { id: 'question-db-toast' });
          return;
        }
        if (editId) {
          await API.put(`/question-database/${editId}`, formData);
          toast.success('Question updated successfully.', { id: 'question-db-toast' });
        } else {
          await API.post('/question-database', formData);
          toast.success('Question saved successfully.', { id: 'question-db-toast' });
        }
      }
      resetForm();
      fetchQuestions();
      setViewMode('list');
    } catch (error) {
      toast.error(error.message || 'Save failed.', { id: 'question-db-toast' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      question: item.question || '',
      optionA: item.optionA || '',
      optionB: item.optionB || '',
      optionC: item.optionC || '',
      optionD: item.optionD || '',
      optionE: item.optionE || '',
      textA: item.textA || '',
      textB: item.textB || '',
      textC: item.textC || '',
      textD: item.textD || '',
      textE: item.textE || ''
    });
    setEntryMode('manual');
    setViewMode('form');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await API.delete(`/question-database/${id}`);
      toast.success('Question deleted successfully.', { id: 'question-db-toast' });
      fetchQuestions();
    } catch (error) {
      toast.error(error.message || 'Delete failed.', { id: 'question-db-toast' });
    }
  };

  return (
    <div className={mainContainer}>
      <main className={accountMainContainer}>
        <div className={accountTitleSection}>
          <h1 className={accountMainTitle}>Question Database Master</h1>
          <p className={accountMainSubTitle}>Add questions manually or upload them from Excel.</p>
        </div>

        <div className={accountFormCard}>
          {viewMode === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-bold text-slate-800">{editId ? 'Edit Question' : 'Add Questions'}</h2>
                  {!editId && (
                    <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg">
                      <button type="button" onClick={() => setEntryMode('manual')} className={`px-3 py-1 text-[11px] font-bold rounded-md transition cursor-pointer ${entryMode === 'manual' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}>Manual</button>
                      <button type="button" onClick={() => setEntryMode('excel')} className={`px-3 py-1 text-[11px] font-bold rounded-md transition cursor-pointer ${entryMode === 'excel' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}>Excel</button>
                    </div>
                  )}
                </div>
                <button type="button" onClick={() => setViewMode('list')} className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-1.5 rounded-md transition cursor-pointer border border-slate-200 shadow-xs">
                  View List ({questions.length})
                </button>
              </div>

              {entryMode === 'excel' && !editId ? (
                <div className="py-8 px-4 flex flex-col items-center justify-center border-2 border-slate-300 rounded-md bg-slate-50 my-4">
                  <label className="text-sm font-bold text-slate-700 mb-1 cursor-pointer">{excelFile ? excelFile.name : 'Click to select Excel (.xlsx, .xls, .csv) file'}</label>
                  <input type="file" accept=".xlsx,.xls,.csv" onChange={handleExcelFileChange} className="block text-xs text-slate-500 cursor-pointer mt-2" />
                  {excelRows.length > 0 && <span className="mt-3 text-xs font-bold text-emerald-600">Ready to import {excelRows.length} rows.</span>}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields.map(([key, label]) => (
                    <div key={key} className={key === 'question' ? 'md:col-span-2' : ''}>
                      <label className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider mb-1">{label}</label>
                      <input value={formData[key]} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} className={`${inputFieldStyle} border-2`} placeholder={label} />
                    </div>
                  ))}
                </div>
              )}

              <footer className="bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 z-40 shadow-lg w-full h-14 flex items-center">
                <div className={accountFooterInner}>
                  <button type="button" onClick={() => { resetForm(); setViewMode('list'); }} className={accountSecondaryBtn}>Back to List</button>
                  <button disabled={isSaving} type="submit" className={accountPrimaryBtn}>{isSaving ? 'Saving...' : entryMode === 'excel' && !editId ? 'Import Excel' : editId ? 'Update Question' : 'Save Question'}</button>
                </div>
              </footer>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-500">Total Questions: {questions.length}</span>
                <button type="button" onClick={() => { resetForm(); setViewMode('form'); }} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-md transition cursor-pointer border border-blue-600 shadow-xs">+ New Add</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className={artistTableHeadStyle}>
                      <th className="py-2 px-2">ID</th>
                      <th className="py-2 px-2">QUESTION</th>
                      <th className="py-2 px-2">OPTIONS</th>
                      <th className="py-2 px-2 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {loading ? (
                      <tr><td colSpan="4" className="text-center py-5 text-slate-400">Loading questions...</td></tr>
                    ) : questions.length === 0 ? (
                      <tr><td colSpan="4" className="text-center py-5 text-slate-400">No questions found.</td></tr>
                    ) : questions.map((item) => (
                      <tr key={item._id} className={artistTableRowStyle}>
                        <td className="py-2 px-2 font-bold">{item.questionId}</td>
                        <td className="py-2 px-2 font-semibold max-w-md truncate">{item.question}</td>
                        <td className="py-2 px-2">{[item.optionA, item.optionB, item.optionC, item.optionD, item.optionE].filter(Boolean).join(', ')}</td>
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

export default QuestionDatabseMaster;
