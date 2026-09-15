import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
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
  artistActionBtnDeleteClass,
  artistCirclePickerContainer,
  artistCirclePreviewImage,
  artistCirclePlaceholderText
} from '../styles/MasterCSSClass';

const CategoryMaster = () => {
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState('form');
  const [editId, setEditId] = useState(null);
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await API.get('/categories');
      setCategories(res?.data || []);
    } catch {
      toast.error('Failed to load categories.', { id: 'category-master-toast' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setCategoryId('');
    setCategoryName('');
    setImageBase64('');
    setStatus('ACTIVE');
  };

const handleImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image.', { id: 'category-master-toast' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 500;
        const MAX_HEIGHT = 500;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF'; // Fills transparent background with white
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        setImageBase64(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error('Category name is required.', { id: 'category-master-toast' });
      return;
    }

    setIsSaving(true);
    try {
      const payload = { categoryName, imageBase64, status };
      if (editId) {
        await API.put(`/categories/${editId}`, payload);
        toast.success('Category updated successfully.', { id: 'category-master-toast' });
      } else {
        await API.post('/categories', payload);
        toast.success('Category saved successfully.', { id: 'category-master-toast' });
      }
      resetForm();
      fetchCategories();
      setViewMode('form');
    } catch (error) {
      toast.error(error.message || 'Already exist this category.', { id: 'category-master-toast' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setCategoryId(item.categoryId || '');
    setCategoryName(item.categoryName || '');
    setImageBase64(item.imageBase64 || '');
    setStatus(item.status || 'ACTIVE');
    setViewMode('form');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await API.delete(`/categories/${id}`);
      toast.success('Category deleted successfully.', { id: 'category-master-toast' });
      fetchCategories();
    } catch (error) {
      toast.error(error.message || 'Delete failed.', { id: 'category-master-toast' });
    }
  };

  return (
    <div className={mainContainer}>
      <main className={accountMainContainer}>
        <div className={accountTitleSection}>
          <h1 className={accountMainTitle}>Category Master</h1>
          <p className={accountMainSubTitle}>
            {viewMode === 'form' ? 'Add or edit event categories with display images.' : 'Manage category status, image, edit and delete.'}
          </p>
        </div>

        <div className={accountFormCard}>
          {viewMode === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-sm font-bold text-slate-800">{editId ? `Edit ${categoryId}` : 'Add New Category'}</h2>
                <button type="button" onClick={() => setViewMode('list')} className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-1.5 rounded-md transition cursor-pointer border border-slate-200 shadow-xs">
                  View List ({categories.length})
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                <div className="md:col-span-5">
                  <label className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider mb-1">Category Name</label>
                  <input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className={`${inputFieldStyle} border-2`} placeholder="Enter category name" />
                </div>
                <div className="md:col-span-3">
                  <label className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider mb-1">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${inputFieldStyle} border-2`}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
                <div className="md:col-span-4 flex flex-col items-center">
                  <label className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider mb-1">Image</label>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleImageFile(e.dataTransfer.files?.[0]);
                    }}
                    className={`${artistCirclePickerContainer} relative overflow-hidden`}
                  >
                    {imageBase64 ? (
                      <img src={imageBase64} alt="Category preview" className={artistCirclePreviewImage} />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center pointer-events-none">
                        <span className={artistCirclePlaceholderText}>Upload</span>
                        <span className="text-[9px] text-slate-400">or drop</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => handleImageFile(e.target.files?.[0])} className="absolute inset-0 opacity-0 cursor-pointer rounded-full" />
                  </div>
                </div>
              </div>

              <footer className="bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 z-40 shadow-lg w-full h-14 flex items-center">
                <div className={accountFooterInner}>
                  <button type="button" onClick={() => { resetForm(); setViewMode('form'); }} className={accountSecondaryBtn}>Back to List</button>
                  <button disabled={isSaving} type="submit" className={accountPrimaryBtn}>{isSaving ? 'Saving...' : editId ? 'Update Category' : 'Save Category'}</button>
                </div>
              </footer>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-500">Total Categories: {categories.length}</span>
                <button type="button" onClick={() => { resetForm(); setViewMode('form'); }} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-md transition cursor-pointer border border-blue-600 shadow-xs">
                  + New Add
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className={artistTableHeadStyle}>
                      {/* <th className="py-2 px-2">ID</th> */}
                      <th className="py-2 px-2">SL</th>
                      <th className="py-2 px-2">IMAGE</th>
                      <th className="py-2 px-2">CATEGORY NAME</th>
                      <th className="py-2 px-2">STATUS</th>
                      <th className="py-2 px-2 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {loading ? (
                      <tr><td colSpan="5" className="text-center py-5 text-slate-400">Loading categories...</td></tr>
                    ) : categories.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-5 text-slate-400">No categories found.</td></tr>
                    ) : categories.map((item,index) => (
                      <tr key={item._id} className={artistTableRowStyle}>
                        {/* <td className="py-2 px-2 font-bold">{item.categoryId}</td> */}
                        <td className="py-2 px-2 ">{index+1}</td>
                        <td className="py-2 px-2">{item.imageBase64 ? <img src={item.imageBase64} alt="" className="w-9 h-9 " /> : 'N/A'}</td>
                        <td className="py-2 px-2 font-semibold">{item.categoryName}</td>
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

export default CategoryMaster;
