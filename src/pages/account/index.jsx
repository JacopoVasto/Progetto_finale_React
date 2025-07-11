import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import supabase from '../../supabase/supabase-client';
import SessionContext from '../../context/SessionContext';
import FavoritesContext from '../../context/FavoritesContext';
import Avatar from '../../components/Avatar';
import Modal from '../../components/Modal';
import { Trash2 } from 'lucide-react';

// Fallback path nel bucket
const fallbackAvatarPath = 'vault_profile_logo.png';
// Stile lista preferiti
const favoriteGameUI = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '0.5rem'
};

export default function AccountPage() {
  const { session } = useContext(SessionContext);
  const { favorites, removeFavorite } = useContext(FavoritesContext);
  const userId = session.user.id;

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatarPath, setAvatarPath] = useState(fallbackAvatarPath);
  const [avatarUrl, setAvatarUrl] = useState('');

  // Modal refs
  const errorModalRef = useRef(null);
  const favModalRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Local copy of favorites for modal editing, with marked flag
  const [localFavorites, setLocalFavorites] = useState([]);

  // Generate signed URL valid for 7 days
  const makeSignedUrl = useCallback(async (path) => {
    try {
      const { data, error } = await supabase
        .storage
        .from('avatars')
        .createSignedUrl(path, 60 * 60 * 24 * 7);
      if (error) throw error;
      return data.signedUrl;
    } catch {
      return '';
    }
  }, []);

  // Load profile and avatar URL
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('username, first_name, last_name, avatar_url')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setUsername(data.username || '');
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        const path = data.avatar_url || fallbackAvatarPath;
        setAvatarPath(path);
        const url = await makeSignedUrl(path);
        setAvatarUrl(url);
      }
      setLoading(false);
    };
    loadProfile();
  }, [userId, makeSignedUrl]);

  // Save all fields (including avatarPath)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updates = {
      id: userId,
      username,
      first_name: firstName,
      last_name: lastName,
      avatar_url: avatarPath,
      updated_at: new Date(),
    };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) {
      setErrorMessage(`Profile update error: ${error.message}`);
      errorModalRef.current?.showModal();
    } else {
      const url = await makeSignedUrl(avatarPath);
      setAvatarUrl(url);
      setErrorMessage('Profile updated successfully!');
      errorModalRef.current?.showModal();
    }
    setLoading(false);
  };

  // Update path and preview avatar without saving to DB
  const handleAvatarUpload = async (_event, newPath) => {
    setAvatarPath(newPath);
    setLoading(true);
    const url = await makeSignedUrl(newPath);
    setAvatarUrl(url);
    setLoading(false);
  };

  // Open favorites modal and initialize localFavorites with marked=false
  const openFavoritesModal = () => {
    setLocalFavorites(favorites.map(fav => ({ ...fav, marked: false })));
    favModalRef.current?.showModal();
  };

  // Toggle marked state for a game
  const toggleMark = (id) => {
    setLocalFavorites(lfs => lfs.map(lf => lf.id === id ? { ...lf, marked: !lf.marked } : lf));
  };

  // Save changes: remove only marked items
  const handleSaveFavorites = () => {
    localFavorites
      .filter(lf => lf.marked)
      .forEach(lf => removeFavorite(lf.game_id));
    favModalRef.current?.close();
  };

  // Cancel without saving
  const handleCancelFavorites = () => {
    favModalRef.current?.close();
  };

  const floatingLabel = (id, label, value, setter, type = 'text', required = false) => (
    <label className="form-control w-full floating-label relative" htmlFor={id}>
      <span className="label-text">{label}</span>
      <input
        id={id}
        name={id}
        type={type}
        className="input input-md input-bordered w-full pr-12"
        placeholder={label}
        value={value}
        onChange={(e) => setter(e.target.value)}
        required={required}
        disabled={loading}
      />
    </label>
  );

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar */}
        <Avatar url={avatarUrl} size={150} onUpload={handleAvatarUpload} />

        {/* Email read-only */}
         <label className="form-control w-full floating-label relative" htmlFor="eMail">
      <span className="label-text">eMail</span>
      <input
        id="eMail"
        name="eMail"
        type="email"
        className="input input-md input-bordered w-full pr-12"
        value={session.user.email}
        onChange={(e) => setter(e.target.value)}
        disabled
      />
    </label>

        {/* Text fields */}
        {floatingLabel('username', 'Username', username, setUsername, 'text', true)}
        {floatingLabel('first_name', 'First name', firstName, setFirstName)}
        {floatingLabel('last_name', 'Last name', lastName, setLastName)}

        {/* Save button */}
        <button type="submit" disabled={loading} className="btn btnSpecial w-full">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* Button to open favorites modal */}
      <button
        type="button"
        className="btn btn-secondary mt-6 w-full"
        onClick={openFavoritesModal}
      >
        Manage Favorites
      </button>

      {/* Favorites management modal */}
      <Modal
        id="favorites-modal"
        ref={favModalRef}
        title="Manage Favorites"
        showCloseButton={false}
      >
        {/* Scrollable favorites list */}
        <div className="overflow-y-auto max-h-[50vh]">
          {localFavorites.length === 0 ? (
            <p>No favorites at the moment...</p>
          ) : (
            <ul>
              {localFavorites.map((game) => (
                <li key={game.id} style={favoriteGameUI}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      width={50}
                      height={50}
                      src={game.game_image}
                      alt={`Cover for ${game.game_name}`} 
                      className="mr-2"
                    />
                    <span>{game.game_name}</span>
                  </div>
                  <button
                    className={`btn btn-sm ${game.marked ? 'btn-error' : ''}`}
                    onClick={() => toggleMark(game.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Always-visible action buttons */}
        <div className="modal-action">
          <button className="btn" onClick={handleCancelFavorites}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSaveFavorites}>Save</button>
        </div>
      </Modal>

      {/* Error/success modal */}
      <Modal
        id="error-account-modal"
        ref={errorModalRef}
        title={errorMessage.startsWith('Profile updated') ? 'Success' : 'Error'}
      >
        <p>{errorMessage}</p>
      </Modal>
    </div>
  );
}
