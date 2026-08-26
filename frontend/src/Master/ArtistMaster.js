import React, { useState, useEffect } from 'react';
import API from '../utils/api';
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
} from '../styles/MasterCSSClass';

const ArtistMaster = () => {
  const [artists, setArtists] = useState([]);
  const [viewMode, setViewMode] = useState('form');

  const [editId, setEditId] = useState(null);
  const [artistName, setArtistName] = useState('');
  const [artistType, setArtistType] = useState('ARTIST');
  const [description, setDescription] = useState('');
  const [photoBase64, setPhotoBase64] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter States for the List View
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
      alert('FAILED TO LOAD ARTISTS DATABASE');
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

  const resetForm = () => {
    setEditId(null);
    setArtistName('');
    setArtistType('SINGER');
    setDescription('');
    setPhotoBase64('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      artistName: artistName.toUpperCase(),
      artistType: artistType.toUpperCase(),
      description: description.toUpperCase(),
      photoBase64,
    };

    try {
      if (editId) {
        await API.put(`/artists/${editId}`, payload);
        alert('ARTIST UPDATED SUCCESSFULLY');
      } else {
        await API.post('/artists', payload);
        alert('ARTIST SAVED SUCCESSFULLY');
      }
      resetForm();
      fetchArtists();
      setViewMode('list');
    } catch (err) {
      alert(err?.response?.data?.error || 'SAVE FAILED - CHECK SERVER');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setArtistName(item.artistName || '');
    setArtistType(item.artistType || 'SINGER');
    setDescription(item.description || '');
    setPhotoBase64(item.photoUrl || '');
    setViewMode('form');
  };

  const handleDelete = async (recordId) => {
    if (window.confirm('ARE YOU SURE YOU WANT TO DELETE THIS ARTIST?')) {
      try {
        await API.delete(`/artists/${recordId}`);
        alert('ARTIST DELETED SUCCESSFULLY');
        fetchArtists();
      } catch {
        alert('DELETE FAILED');
      }
    }
  };

  const filteredData = artists.filter((item) => {
    const matchesType = filterType === 'ALL' || item.artistType?.toUpperCase() === filterType;
    const matchesSearch = !searchTerm.trim() || (item.artistName && item.artistName.trim().toLowerCase().startsWith(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className={`${mainContainer} ${artistPageWrapper}`}>
      {/* TOP HEADER WITH VIEW SWITCHERS */}
      <header className={`${navbar} px-4 py-1.5 flex items-center justify-between shadow-xs shrink-0`}>
        <h1 className={brandTitle}>ARTIST MASTER MANAGEMENT</h1>

        <div className="flex items-center space-x-2">
          {viewMode === 'list' ? (
            <button
              type="button"
              onClick={() => {
                resetForm();
                setViewMode('form');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1 rounded-xl transition cursor-pointer border border-blue-600 uppercase shadow-xs flex items-center space-x-1"
            >
              <span>+ NEW ADD</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1 rounded-xl transition cursor-pointer border border-slate-200 uppercase shadow-xs flex items-center space-x-1"
            >
              <span>📋 VIEW LIST</span>
              <span className="bg-slate-200 text-slate-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">{artists.length}</span>
            </button>
          )}
        </div>
      </header>

      {/* FULL WIDTH COMPACT WORKSPACE */}
      <div className={artistWorkspace}>
        {viewMode === 'form' ? (
          /* FORM VIEW */
          <form onSubmit={handleSubmit} className={artistFormBox}>
            <div className={artistFormHeader}>
              <h2 className={artistFormHeading}>
                {editId ? 'EDIT ARTIST DETAILS' : 'ADD NEW ARTIST'}
              </h2>
              {editId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-[10px] font-bold text-slate-500 hover:text-slate-800 cursor-pointer uppercase"
                >
                  CLEAR
                </button>
              )}
            </div>

            <div className={artistFormGrid}>
              <div>
                <label className={artistLabelStyle}>ARTIST NAME (OPTIONAL)</label>
                <input
                  autoFocus
                  type="text"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value.toUpperCase())}
                  placeholder="E.G. ARIJIT SINGH"
                  className={artistInputStyle}
                />
              </div>

              <div>
                <label className={artistLabelStyle}>TYPE / CATEGORY</label>
                <select
                  value={artistType}
                  onChange={(e) => setArtistType(e.target.value)}
                  className={artistInputStyle}
                >
                  <option value="ARTIST">ARTIST</option>
                  <option value="SINGER">SINGER</option>
                  <option value="ACTOR">ACTOR</option>
                  <option value="BAND">BAND</option>
                  <option value="DJ">DJ</option>
                  <option value="COMEDIAN">COMEDIAN</option>
                  <option value="PERFORMER">PERFORMER</option>
                </select>
              </div>
            </div>

            <div>
              <label className={artistLabelStyle}>DESCRIPTION (OPTIONAL)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.toUpperCase())}
                placeholder="SHORT BIO OR DESCRIPTION..."
                rows="2"
                className={artistTextareaStyle}
              />
            </div>

            <div>
              <label className={artistLabelStyle}>ARTIST PHOTO (OPTIONAL)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="w-full text-xs text-slate-500 file:mr-3 file:py-1 file:px-2.5 file:rounded-xl file:border-0 file:text-[11px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-0.5 rounded-xl transition cursor-pointer border border-slate-200 uppercase"
              >
                BACK TO LIST
              </button>

              <button
                disabled={isSaving || loading}
                type="submit"
                className={`${primaryButton} py-0.5 px-5 cursor-pointer text-xs uppercase`}
              >
                {isSaving ? 'SAVING...' : editId ? 'UPDATE ARTIST' : 'SAVE ARTIST'}
              </button>
            </div>
          </form>
        ) : (
          /* LIST VIEW */
          <div className={artistListCard}>
            {/* THREE COLUMN GRID: LEFT TYPE FILTER | MIDDLE SEARCH BAR | RIGHT COUNT/CLEAR */}
            <div className={artistListHeaderRow}>
              {/* Left: Type Filter */}
              <div className="flex items-center space-x-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1 text-xs font-medium uppercase focus:outline-none"
                >
                  <option value="ALL">ALL TYPES</option>
                  <option value="ARTIST">ARTIST</option>
                  <option value="SINGER">SINGER</option>
                  <option value="ACTOR">ACTOR</option>
                  <option value="BAND">BAND</option>
                  <option value="DJ">DJ</option>
                  <option value="COMEDIAN">COMEDIAN</option>
                  <option value="PERFORMER">PERFORMER</option>
                </select>
                <span className="text-[11px] font-bold text-slate-400 uppercase">({filteredData.length})</span>
              </div>

              {/* Middle: Search Bar */}
              <div className="flex items-center justify-center space-x-1.5">
                <input
                  type="text"
                  maxLength="1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                  placeholder="SEARCH 1ST LETTER (E.G. R)"
                  className={artistSearchInputCenter}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-[10px] font-bold text-rose-500 hover:text-rose-700 cursor-pointer uppercase"
                  >
                    CLEAR
                  </button>
                )}
              </div>

              {/* Right: Title / Actions Indicator */}
              <div className="text-right">
                <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-800">REGISTERED ARTISTS</h2>
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
                <tbody className="divide-y divide-slate-100 text-slate-700 uppercase">
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
                            EDIT
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item._id)}
                            className={artistActionBtnDeleteClass}
                          >
                            DELETE
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-slate-400 text-xs">NO ARTISTS FOUND.</td>
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