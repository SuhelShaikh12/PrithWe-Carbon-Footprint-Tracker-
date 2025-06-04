


// RegisterForm.jsx (upon success, redirect to /verify-email)
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function RegisterForm() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   async function handleSubmit(e) {
//     e.preventDefault();
//     // Call backend to register user
//     const res = await fetch('/auth/register', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ name, email, password, type: 'user' }),
//     });
//     if (res.ok) {
//       // Redirect to verify email page on success
//       navigate('/verify-email');
//     } else {
//       // handle error (e.g. show message)
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
//       <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
//       <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
//       <button type="submit">Register</button>
//     </form>
//   );
// }

// export default RegisterForm;




import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, type: 'user' }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save email to localStorage so OTP screen can access it
        localStorage.setItem('pendingEmail', email);
        navigate('/verify-otp');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Register</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default RegisterForm;
