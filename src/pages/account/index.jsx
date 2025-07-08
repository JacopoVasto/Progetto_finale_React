import { useState, useEffect, useContext, useCallback } from 'react';
import supabase from '../../supabase/supabase-client';
import SessionContext from '../../context/SessionContext';
import Avatar from '../../components/Avatar';

// Fallback path nel bucket
const fallbackAvatarPath = 'vault_profile_logo.png';

export default function AccountPage() {
  const { session } = useContext(SessionContext);
  const userId = session.user.id;

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  // path corrente nel bucket (es. "12345.png")
  const [avatarPath, setAvatarPath] = useState(fallbackAvatarPath);
  // url visualizzato (rigenerato solo al submit)
  const [avatarUrl, setAvatarUrl] = useState('');

  // Genera Signed URL valida 7 giorni
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

  // Carica profilo e URL avatar corrente
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

  // Salva tutti i campi (incluso avatarPath)
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
      alert('Errore aggiornamento profilo: ' + error.message);
    } else {
      // rigenera signed URL per il nuovo avatar
      const url = await makeSignedUrl(avatarPath);
      setAvatarUrl(url);
      alert('Profilo aggiornato!');
    }
    setLoading(false);
  };

    // Aggiorna il path e mostra subito l’anteprima
  const handleAvatarUpload = async (_event, newPath) => {
    setAvatarPath(newPath);
    // rigenera l'URL per anteprima, senza salvare sul DB
    setLoading(true);
    const url = await makeSignedUrl(newPath);
    setAvatarUrl(url);
    setLoading(false);
  };

  // Helper form field
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
        <Avatar
          url={avatarUrl}
          size={150}
          onUpload={handleAvatarUpload}
        />

        {/* Email non editabile */}
        <div>
          <label className="label-text">Email</label>
          <input
            type="email"
            value={session.user.email}
            disabled
            className="input input-md input-bordered w-full bg-gray-100"
          />
        </div>

        {/* Campi testo */}
        {floatingLabel('username', 'Username', username, setUsername, 'text', true)}
        {floatingLabel('first_name', 'First name', firstName, setFirstName)}
        {floatingLabel('last_name', 'Last name', lastName, setLastName)}

        {/* Bottone salva */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
