import { useState, useEffect, useContext } from 'react';
import supabase from '../../supabase/supabase-client';
import SessionContext from '../../context/SessionContext';
import Avatar from '../../components/Avatar';

export default function AccountPage() {
  const { session } = useContext(SessionContext);
  const { user } = session;

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [avatar_url, setAvatarUrl] = useState('');

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('username, first_name, last_name, avatar_url')
        .eq('id', user.id)
        .single();

      if (error) {
        console.warn('Errore nel recupero profilo:', error.message);
      } else {
        setUsername(data.username || '');
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setAvatarUrl(data.avatar_url || '');
      }

      setLoading(false);
    };

    getProfile();
  }, [user.id]);

  const updateProfile = async (e, updatedAvatarUrl = avatar_url) => {
    e.preventDefault();
    setLoading(true);

    const updates = {
      id: user.id,
      username,
      first_name,
      last_name,
      avatar_url: updatedAvatarUrl,
      updated_at: new Date(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) {
      alert('Errore durante aggiornamento: ' + error.message);
    } else {
      setAvatarUrl(updatedAvatarUrl); // aggiorna stato solo se va tutto bene
      alert('Profilo aggiornato con successo!');
    }

    setLoading(false);
  };

  const floatingLabel = (id, label, value, setter, type = "text", required = false, disabled = false) => (
    <label className="form-control w-full floating-label relative">
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
        disabled={disabled}
      />
    </label>
  );

  return (
    <div className="container">
      <h2>Profile Settings</h2>

      <form onSubmit={updateProfile} className="form-widget space-y-4">
        {/* Avatar */}
        <Avatar
          url={avatar_url}
          size={150}
          onUpload={(event, url) => {
            updateProfile(event, url); // aggiorna con nuovo URL immagine
          }}
        />

        {floatingLabel("email", "Email", user.email, () => {}, "email", false, true)}
        {floatingLabel("username", "Username", username, setUsername, "text", true)}
        {floatingLabel("first_name", "First name", first_name, setFirstName)}
        {floatingLabel("last_name", "Last name", last_name, setLastName)}

        <div>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Loading...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
}
