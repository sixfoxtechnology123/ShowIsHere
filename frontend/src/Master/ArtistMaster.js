import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import {
  mainContainer,
  navbar,
  brandTitle,
  primaryButton,
  artistPageWrapper,
  artistWorkspace,
  artistFormBox,
  artistFormHeader,
  artistFormHeading,
  artistFormGrid,
  artistLabelStyle,
  artistInputStyle,
  artistTextareaStyle,
  artistListCard,
  artistListHeaderRow,
  artistSearchInputCenter,
  artistTableHeadStyle,
  artistTableRowStyle,
  artistAvatarCircle,
  artistAvatarFallback,
  artistActionBtnEditClass,
  artistActionBtnDeleteClass,
  artistThSlNo,
  artistTdSlNo,
  artistThPhoto,
  artistThName,
  artistThType,
  artistThDesc,
  artistThAction,
  artistCirclePickerContainer,
  artistCirclePreviewImage,
  artistCirclePlaceholderText,
  artistDescImageGrid,
} from '../styles/MasterCSSClass';

const ArtistMaster = () => {
  const [artists, setArtists] = useState([]);
  const [viewMode, setViewMode] = useState('form');
  const [entryMode, setEntryMode] = useState('manual');

  const [editId, setEditId] = useState(null);
  const [artistName, setArtistName] = useState('');
  const [artistType, setArtistType] = useState('Artist');
  const [description, setDescription] = useState('');
  const [photoBase64, setPhotoBase64] = useState('');
  
  const [excelFile, setExcelFile] = useState(null);
  const [excelData, setExcelData] = useState([]);

  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    setLoading(true);
    try {
      const res = await API.get('/artists');
      setArtists(Array.isArray(res) ? res : res.data || []);
    } catch {
      toast.error('Failed to load artists database');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExcelFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setExcelFile(file);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        setExcelData(data);
        toast.success(`Loaded ${data.length} records from Excel`);
      } catch (err) {
        toast.error('Failed to parse Excel file');
        console.error(err);
      }
    };
    reader.readAsBinaryString(file);
  };

  const resetForm = () => {
    setEditId(null);
    setArtistName('');
    setArtistType('Artist');
    setDescription('');
    setPhotoBase64('');
    setExcelFile(null);
    setExcelData([]);
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (entryMode === 'excel') {
        if (!excelData || excelData.length === 0) {
          toast.error('Please upload a valid Excel file first');
          setIsSaving(false);
          return;
        }

        const formattedRows = excelData.map(row => ({
          artistName: row['Artist Name'] || row.artistName || row.Name || row.NAME || '',
          artistType: row['Category'] || row.artistType || row.Type || row.TYPE || 'Artist',
          description: row['Description'] || row.description || row.DESCRIPTION || '',
          photoUrl: ''
        }));

        // Send as an array
        await API.post('/artists', formattedRows);
        toast.success(`Successfully uploaded ${formattedRows.length} records from Excel!`);
        resetForm();
        fetchArtists();
        setViewMode('list');
      } else {
        const payload = {
          artistName,
          artistType,
          description,
          photoBase64,
        };

        if (editId) {
          await API.put(`/artists/${editId}`, payload);
          toast.success('Artist updated successfully');
        } else {
          await API.post('/artists', payload);
          toast.success('Artist saved successfully');
        }
        resetForm();
        fetchArtists();
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Save failed - check server');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setArtistName(item.artistName || '');
    setArtistType(item.artistType || 'Artist');
    setDescription(item.description || '');
    setPhotoBase64(item.photoUrl || '');
    setEntryMode('manual');
    setViewMode('form');
  };

  const handleDelete = async (recordId) => {
    if (window.confirm('Are you sure you want to delete this artist?')) {
      try {
        await API.delete(`/artists/${recordId}`);
        toast.success('Artist deleted successfully');
        fetchArtists();
      } catch {
        toast.error('Delete failed');
      }
    }
  };

  const filteredData = artists.filter((item) => {
    const matchesType = filterType === 'ALL' || item.artistType?.toLowerCase() === filterType.toLowerCase();
    const matchesSearch = !searchTerm.trim() || (item.artistName && item.artistName.trim().toLowerCase().startsWith(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className={`${mainContainer} ${artistPageWrapper}`}>
      <header className={`${navbar} px-4 py-1.5 flex items-center justify-between shadow-xs shrink-0`}>
        <h1 className={brandTitle}>ARTIST MASTER MANAGEMENT</h1>
        <div className="flex items-center space-x-2">
          {viewMode === 'list' ? (
            <button
              type="button"
              onClick={() => { resetForm(); setViewMode('form'); }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1 rounded-xl transition cursor-pointer border border-blue-600 shadow-xs flex items-center space-x-1"
            >
              <span>+ New Add</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1 rounded-xl transition cursor-pointer border border-slate-200 shadow-xs flex items-center space-x-1"
            >
              <span>📋 View List</span>
              <span className="bg-slate-200 text-slate-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">{artists.length}</span>
            </button>
          )}
        </div>
      </header>

      <div className={artistWorkspace}>
        {viewMode === 'form' ? (
          <form onSubmit={handleSubmit} className={artistFormBox}>
            <div className={artistFormHeader}>
              <h2 className={artistFormHeading}>
                {editId ? 'Edit Artist Details' : 'Add New Artist'}
              </h2>
              {!editId && (
                <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setEntryMode('manual')}
                    className={`px-3 py-1 text-[11px] font-bold rounded-md transition cursor-pointer ${
                      entryMode === 'manual' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Manual Entry
                  </button>
                  <button
                    type="button"
                    onClick={() => setEntryMode('excel')}
                    className={`px-3 py-1 text-[11px] font-bold rounded-md transition cursor-pointer ${
                      entryMode === 'excel' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Excel Upload
                  </button>
                </div>
              )}
            </div>

            {entryMode === 'excel' && !editId ? (
              <div className="py-8 px-4 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 my-4">
                <label className="text-sm font-bold text-slate-700 mb-1 cursor-pointer">
                  {excelFile ? excelFile.name : 'Click to select Excel (.xlsx, .xls) file'}
                </label>
                <input 
                  type="file" 
                  accept=".xlsx, .xls, .csv" 
                  onChange={handleExcelFileChange}
                  className="block text-xs text-slate-500 cursor-pointer mt-2"
                />
                {excelData.length > 0 && (
                  <span className="mt-3 text-xs font-bold text-emerald-600">
                    ✓ Ready to import {excelData.length} records. Click Save below.
                  </span>
                )}
              </div>
            ) : (
              <>
                <div className={artistFormGrid}>
                  <div>
                    <label className={artistLabelStyle}>Artist Name</label>
                    <input
                      autoFocus
                      type="text"
                      value={artistName}
                      onChange={(e) => setArtistName(e.target.value)}
                      placeholder="e.g. Arijit Singh"
                      className={artistInputStyle}
                    />
                  </div>

                  <div>
                    <label className={artistLabelStyle}>Type / Category</label>
                    <select
                      value={artistType}
                      onChange={(e) => setArtistType(e.target.value)}
                      className={artistInputStyle}
                    >
                      <option value="Artist">Artist</option>
                      <option value="Singer">Singer</option>
                      <option value="Actor">Actor</option>
                      <option value="Band">Band</option>
                      <option value="DJ">DJ</option>
                      <option value="Comedian">Comedian</option>
                      <option value="Performer">Performer</option>
                    </select>
                  </div>
                </div>

                <div className={artistDescImageGrid}>
                  <div className="md:col-span-9">
                    <label className={artistLabelStyle}>Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Type short bio or description here..."
                      rows="2"
                      className={artistTextareaStyle}
                    />
                  </div>

                  <div className="md:col-span-3 flex flex-col items-center">
                    <label className={artistLabelStyle}>Photo</label>
                    <label className={artistCirclePickerContainer}>
                      {photoBase64 ? (
                        <img src={photoBase64} alt="Preview" className={artistCirclePreviewImage} />
                      ) : (
                        <span className={artistCirclePlaceholderText}>Upload</span>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1 rounded-xl transition cursor-pointer border border-slate-200"
              >
                Back to List
              </button>

              <button
                disabled={isSaving || loading}
                type="submit"
                className={`${primaryButton} py-1 px-5 cursor-pointer text-xs`}
              >
                {isSaving ? 'Saving...' : entryMode === 'excel' && !editId ? 'Import & Save Excel' : editId ? 'Update Artist' : 'Save Artist'}
              </button>
            </div>
          </form>
        ) : (
          <div className={artistListCard}>
            <div className={artistListHeaderRow}>
              <div className="flex items-center space-x-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1 text-xs font-medium focus:outline-none"
                >
                  <option value="ALL">All Types</option>
                  <option value="Artist">Artist</option>
                  <option value="Singer">Singer</option>
                  <option value="Actor">Actor</option>
                  <option value="Band">Band</option>
                  <option value="DJ">DJ</option>
                  <option value="Comedian">Comedian</option>
                  <option value="Performer">Performer</option>
                </select>
                <span className="text-[11px] font-bold text-slate-400">({filteredData.length})</span>
              </div>

           <div className="flex items-center justify-center space-x-1.5">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search artist name..."
                  className={artistSearchInputCenter}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-[10px] font-bold text-rose-500 hover:text-rose-700 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="text-right">
                <h2 className="text-xs font-extrabold tracking-wide text-slate-800">REGISTERED ARTISTS</h2>
              </div>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className={artistTableHeadStyle}>
                    <th className={artistThSlNo}>SL</th>
                    <th className={artistThPhoto}>PHOTO</th>
                    <th className={artistThName}>NAME</th>
                    <th className={artistThType}>TYPE</th>
                    <th className={artistThDesc}>DESCRIPTION</th>
                    <th className={artistThAction}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-3 text-slate-400 text-xs">Loading Artists...</td>
                    </tr>
                  ) : filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr key={item._id} className={artistTableRowStyle}>
                        <td className={artistTdSlNo}>{index + 1}</td>
                        <td className="py-0.5 px-2">
                          {item.photoUrl ? (
                            <img src={item.photoUrl} alt="" className={artistAvatarCircle} />
                          ) : (
                            <div className={artistAvatarFallback}>👤</div>
                          )}
                        </td>
                        <td className="py-0.5 px-2 font-semibold">{item.artistName || 'N/A'}</td>
                        <td className="py-0.5 px-2">{item.artistType}</td>
                        <td className="py-0.5 px-2 truncate max-w-md">{item.description || 'N/A'}</td>
                        <td className="py-0.5 px-2 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-slate-400 text-xs">No artists found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistMaster;