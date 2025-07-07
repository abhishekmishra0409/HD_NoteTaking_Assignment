import { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:5000/api';


interface Note {
    _id: string;
    title: string;
    content: string;
    user: string;
    createdAt: string;
    updatedAt: string;
}

interface User {
    _id: string;
    name: string;
    email: string;
    isVerified: boolean;
}

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [editingProfile, setEditingProfile] = useState(false);
    const [updatedName, setUpdatedName] = useState('');
    const [updatedEmail, setUpdatedEmail] = useState('');
    const [newNote, setNewNote] = useState({ title: '', content: '' });
    const [showNoteForm, setShowNoteForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch user profile and notes on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    window.location.reload();
                    return;
                }

                // Set default axios headers
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // Fetch user profile
                const userResponse = await axios.get(`${API_BASE}/users/profile`);
                setUser(userResponse.data);
                setUpdatedName(userResponse.data.name);
                setUpdatedEmail(userResponse.data.email);

                // Fetch notes
                const notesResponse = await axios.get(`${API_BASE}/notes`);
                setNotes(notesResponse.data);
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    window.location.reload();
                } else {
                    setError('Failed to fetch data. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleDeleteNote = async (noteId: string) => {
        try {
            await axios.delete(`${API_BASE}/notes/${noteId}`);
            setNotes(notes.filter(note => note._id !== noteId));
        } catch (err) {
            setError('Failed to delete note. Please try again.');
        }
    };

    const handleSaveProfile = async () => {
        try {
            const response = await axios.put(`${API_BASE}/users/profile`, {
                name: updatedName,
                email: updatedEmail
            });
            setUser(response.data);
            setEditingProfile(false);
        } catch (err) {
            setError('Failed to update profile. Please try again.');
        }
    };

    const handleCreateNote = async () => {
        try {
            const response = await axios.post(`${API_BASE}/notes`, newNote);
            setNotes([response.data, ...notes]);
            setNewNote({ title: '', content: '' });
            setShowNoteForm(false);
        } catch (err) {
            setError('Failed to create note. Please try again.');
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        navigate('/login');
        window.location.reload();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <img src="/icon.png" alt="Logo" className="w-6 h-6" />
                        <h1 className="text-xl font-semibold">Dashboard</h1>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="text-blue-600 hover:underline text-sm font-medium"
                    >
                        Sign Out
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        {error}
                        <button
                            onClick={() => setError('')}
                            className="absolute top-0 right-0 px-2 py-1"
                        >
                            &times;
                        </button>
                    </div>
                )}

                {/* Profile Section */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    {editingProfile ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    value={updatedName}
                                    onChange={(e) => setUpdatedName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    value={updatedEmail}
                                    onChange={(e) => setUpdatedEmail(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setEditingProfile(false)}
                                    className="px-4 py-2 text-sm bg-gray-300 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveProfile}
                                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <div>
                                <p className="font-semibold text-lg">Welcome, {user.name}!</p>
                                <p className="text-gray-600 text-sm">Email: {user.email}</p>
                                <p className="text-gray-600 text-sm">
                                    Status: {user.isVerified ? 'Verified' : 'Not Verified'}
                                </p>
                            </div>
                            <button
                                onClick={() => setEditingProfile(true)}
                                className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1 text-sm"
                            >
                                <FiEdit /> Edit Profile
                            </button>
                        </div>
                    )}
                </div>

                {/* Notes Section */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Your Notes</h3>
                        <button
                            onClick={() => setShowNoteForm(!showNoteForm)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1 text-sm"
                        >
                            <FiPlus /> {showNoteForm ? 'Cancel' : 'New Note'}
                        </button>
                    </div>

                    {/* Create Note Form */}
                    {showNoteForm && (
                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        placeholder="Note title"
                                        value={newNote.title}
                                        onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                    <textarea
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        rows={4}
                                        placeholder="Write your note here..."
                                        value={newNote.content}
                                        onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                                    ></textarea>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleCreateNote}
                                        disabled={!newNote.title || !newNote.content}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        Save Note
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notes List */}
                    <div className="space-y-4">
                        {notes.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">You don't have any notes yet.</p>
                        ) : (
                            notes.map((note) => (
                                <div
                                    key={note._id}
                                    className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:border-blue-300 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium text-lg">{note.title}</h4>
                                            <p className="text-gray-600 mt-1">{note.content}</p>
                                            <p className="text-gray-400 text-xs mt-2">
                                                Created: {new Date(note.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteNote(note._id)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                            title="Delete note"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}