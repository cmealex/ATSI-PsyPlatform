/**
 * Data management for the therapy platform - SUPABASE VERSION
 * This file provides functions for loading, saving, and manipulating data
 * using Supabase for server-side persistence
 * 
 * ⚠️ IMPORTANT: All functions are now ASYNC and return Promises
 * Update all calling code to use await or .then()
 */

const TherapyData = {
    /**
     * Initialize - check Supabase connection
     */
    init: async function() {
        try {
            // Test connection
            const { data, error } = await supabase.from('users').select('count');
            if (error) throw error;
            console.log('✅ Supabase connection established');
            return true;
        } catch (error) {
            console.error('❌ Supabase connection failed:', error);
            console.error('Make sure you have:');
            console.error('1. Updated supabase-config.js with your credentials');
            console.error('2. Run supabase-schema.sql in your Supabase SQL Editor');
            return false;
        }
    },
    
    // ============================================
    // THERAPIST OPERATIONS
    // ============================================
    
    /**
     * Get all therapists
     * @param {boolean} includeUnapproved - Include unapproved therapists
     * @returns {Promise<Array>} Array of therapist objects
     */
    getTherapists: async function(includeUnapproved = false) {
        try {
            let query = supabase.from('therapists').select('*');
            
            if (!includeUnapproved) {
                query = query.eq('approved', true);
            }
            
            const { data, error } = await query.order('name');
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching therapists:', error);
            return [];
        }
    },
    
    /**
     * Get therapist by ID
     * @param {string} id - Therapist ID
     * @returns {Promise<Object|null>} Therapist object or null
     */
    getTherapistById: async function(id) {
        try {
            const { data, error } = await supabase
                .from('therapists')
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching therapist:', error);
            return null;
        }
    },
    
    /**
     * Save therapist (create or update)
     * @param {Object} therapist - Therapist object
     * @returns {Promise<Object>} Saved therapist object
     */
    saveTherapist: async function(therapist) {
        try {
            if (therapist.id) {
                // Update existing
                const { data, error } = await supabase
                    .from('therapists')
                    .update(therapist)
                    .eq('id', therapist.id)
                    .select()
                    .single();
                
                if (error) throw error;
                return data;
            } else {
                // Insert new (set approved to false by default)
                const newTherapist = {
                    ...therapist,
                    approved: false
                };
                
                const { data, error } = await supabase
                    .from('therapists')
                    .insert([newTherapist])
                    .select()
                    .single();
                
                if (error) throw error;
                return data;
            }
        } catch (error) {
            console.error('Error saving therapist:', error);
            throw error;
        }
    },
    
    /**
     * Approve therapist
     * @param {string} id - Therapist ID
     * @returns {Promise<boolean>} Success status
     */
    approveTherapist: async function(id) {
        try {
            const { error } = await supabase
                .from('therapists')
                .update({ approved: true })
                .eq('id', id);
            
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error approving therapist:', error);
            return false;
        }
    },
    
    /**
     * Delete therapist
     * @param {string} id - Therapist ID
     * @returns {Promise<boolean>} Success status
     */
    deleteTherapist: async function(id) {
        try {
            const { error } = await supabase
                .from('therapists')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting therapist:', error);
            return false;
        }
    },
    
    // ============================================
    // USER OPERATIONS
    // ============================================
    
    /**
     * Get all users
     * @returns {Promise<Array>} Array of user objects
     */
    getUsers: async function() {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('name');
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    },
    
    /**
     * Get user by email
     * @param {string} email - User email
     * @returns {Promise<Object|null>} User object or null
     */
    getUserByEmail: async function(email) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();
            
            if (error) {
                if (error.code === 'PGRST116') return null; // Not found
                throw error;
            }
            return data;
        } catch (error) {
            console.error('Error fetching user by email:', error);
            return null;
        }
    },
    
    /**
     * Get user by ID
     * @param {string} id - User ID
     * @returns {Promise<Object|null>} User object or null
     */
    getUserById: async function(id) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            return null;
        }
    },
    
    /**
     * Save user (create or update)
     * @param {Object} user - User object
     * @returns {Promise<Object>} Saved user object
     */
    saveUser: async function(user) {
        try {
            if (user.id) {
                // Update existing
                const { data, error } = await supabase
                    .from('users')
                    .update(user)
                    .eq('id', user.id)
                    .select()
                    .single();
                
                if (error) throw error;
                return data;
            } else {
                // Insert new
                const { data, error } = await supabase
                    .from('users')
                    .insert([user])
                    .select()
                    .single();
                
                if (error) throw error;
                return data;
            }
        } catch (error) {
            console.error('Error saving user:', error);
            throw error;
        }
    },
    
    /**
     * Delete user
     * @param {string} id - User ID
     * @returns {Promise<boolean>} Success status
     */
    deleteUser: async function(id) {
        try {
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting user:', error);
            return false;
        }
    },
    
    // ============================================
    // APPOINTMENT OPERATIONS
    // ============================================
    
    /**
     * Get all appointments
     * @returns {Promise<Array>} Array of appointment objects
     */
    getAppointments: async function() {
        try {
            const { data, error } = await supabase
                .from('appointments')
                .select('*')
                .order('date', { ascending: true })
                .order('time', { ascending: true });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching appointments:', error);
            return [];
        }
    },
    
    /**
     * Get appointments by user ID
     * @param {string} userId - User ID
     * @returns {Promise<Array>} Array of appointment objects
     */
    getAppointmentsByUserId: async function(userId) {
        try {
            const { data, error } = await supabase
                .from('appointments')
                .select('*')
                .eq('user_id', userId)
                .order('date', { ascending: true });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching user appointments:', error);
            return [];
        }
    },
    
    /**
     * Get appointments by therapist ID
     * @param {string} therapistId - Therapist ID
     * @returns {Promise<Array>} Array of appointment objects
     */
    getAppointmentsByTherapistId: async function(therapistId) {
        try {
            const { data, error } = await supabase
                .from('appointments')
                .select('*')
                .eq('therapist_id', therapistId)
                .order('date', { ascending: true });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching therapist appointments:', error);
            return [];
        }
    },
    
    /**
     * Save appointment (create or update)
     * @param {Object} appointment - Appointment object
     * @returns {Promise<Object>} Saved appointment object
     */
    saveAppointment: async function(appointment) {
        try {
            if (appointment.id) {
                // Update existing
                const { data, error } = await supabase
                    .from('appointments')
                    .update(appointment)
                    .eq('id', appointment.id)
                    .select()
                    .single();
                
                if (error) throw error;
                return data;
            } else {
                // Insert new
                const { data, error } = await supabase
                    .from('appointments')
                    .insert([appointment])
                    .select()
                    .single();
                
                if (error) throw error;
                return data;
            }
        } catch (error) {
            console.error('Error saving appointment:', error);
            throw error;
        }
    },
    
    // ============================================
    // REVIEW OPERATIONS
    // ============================================
    
    /**
     * Get all reviews
     * @returns {Promise<Array>} Array of review objects
     */
    getReviews: async function() {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching reviews:', error);
            return [];
        }
    },
    
    /**
     * Get reviews by therapist ID
     * @param {string} therapistId - Therapist ID
     * @returns {Promise<Array>} Array of review objects
     */
    getReviewsByTherapistId: async function(therapistId) {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('therapist_id', therapistId)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching therapist reviews:', error);
            return [];
        }
    },
    
    /**
     * Save review (create or update)
     * @param {Object} review - Review object
     * @returns {Promise<Object>} Saved review object
     */
    saveReview: async function(review) {
        try {
            if (review.id) {
                // Update existing
                const { data, error } = await supabase
                    .from('reviews')
                    .update(review)
                    .eq('id', review.id)
                    .select()
                    .single();
                
                if (error) throw error;
                return data;
            } else {
                // Insert new (set approved to false by default)
                const newReview = {
                    ...review,
                    approved: false
                };
                
                const { data, error } = await supabase
                    .from('reviews')
                    .insert([newReview])
                    .select()
                    .single();
                
                if (error) throw error;
                return data;
            }
        } catch (error) {
            console.error('Error saving review:', error);
            throw error;
        }
    },
    
    /**
     * Approve review
     * @param {string} id - Review ID
     * @returns {Promise<boolean>} Success status
     */
    approveReview: async function(id) {
        try {
            const { error } = await supabase
                .from('reviews')
                .update({ approved: true })
                .eq('id', id);
            
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error approving review:', error);
            return false;
        }
    },
    
    /**
     * Delete review
     * @param {string} id - Review ID
     * @returns {Promise<boolean>} Success status
     */
    deleteReview: async function(id) {
        try {
            const { error } = await supabase
                .from('reviews')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting review:', error);
            return false;
        }
    },
    
    // ============================================
    // FORUM OPERATIONS
    // ============================================
    
    /**
     * Get all forum topics
     * @returns {Promise<Array>} Array of topic objects
     */
    getForumTopics: async function() {
        try {
            const { data, error } = await supabase
                .from('forum_topics')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching forum topics:', error);
            return [];
        }
    },
    
    /**
     * Get forum topic by ID
     * @param {string} id - Topic ID
     * @returns {Promise<Object|null>} Topic object or null
     */
    getForumTopicById: async function(id) {
        try {
            const { data, error } = await supabase
                .from('forum_topics')
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching forum topic:', error);
            return null;
        }
    },
    
    /**
     * Save forum topic (create or update)
     * @param {Object} topic - Topic object
     * @returns {Promise<Object>} Saved topic object
     */
    saveForumTopic: async function(topic) {
        try {
            if (topic.id) {
                // Update existing
                const { data, error } = await supabase
                    .from('forum_topics')
                    .update(topic)
                    .eq('id', topic.id)
                    .select()
                    .single();
                
                if (error) throw error;
                return data;
            } else {
                // Insert new
                const { data, error } = await supabase
                    .from('forum_topics')
                    .insert([topic])
                    .select()
                    .single();
                
                if (error) throw error;
                return data;
            }
        } catch (error) {
            console.error('Error saving forum topic:', error);
            throw error;
        }
    },
    
    /**
     * Get all forum replies
     * @returns {Promise<Array>} Array of reply objects
     */
    getForumReplies: async function() {
        try {
            const { data, error } = await supabase
                .from('forum_replies')
                .select('*')
                .order('created_at', { ascending: true });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching forum replies:', error);
            return [];
        }
    },
    
    /**
     * Get forum replies by topic ID
     * @param {string} topicId - Topic ID
     * @returns {Promise<Array>} Array of reply objects
     */
    getForumRepliesByTopicId: async function(topicId) {
        try {
            const { data, error } = await supabase
                .from('forum_replies')
                .select('*')
                .eq('topic_id', topicId)
                .order('created_at', { ascending: true });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching topic replies:', error);
            return [];
        }
    },
    
    /**
     * Save forum reply (create or update)
     * @param {Object} reply - Reply object
     * @returns {Promise<Object>} Saved reply object
     */
    saveForumReply: async function(reply) {
        try {
            if (reply.id) {
                // Update existing
                const { data, error } = await supabase
                    .from('forum_replies')
                    .update(reply)
                    .eq('id', reply.id)
                    .select()
                    .single();
                
                if (error) throw error;
                return data;
            } else {
                // Insert new
                const { data, error } = await supabase
                    .from('forum_replies')
                    .insert([reply])
                    .select()
                    .single();
                
                if (error) throw error;
                return data;
            }
        } catch (error) {
            console.error('Error saving forum reply:', error);
            throw error;
        }
    },
    
    // ============================================
    // RESOURCE OPERATIONS
    // ============================================
    
    /**
     * Get resource by ID
     * @param {string} id - Resource ID
     * @returns {Promise<Object|null>} Resource object or null
     */
    getResourceById: async function(id) {
        // For now, return hardcoded resources (can be moved to DB later)
        const resources = this.resourceContents;
        return resources[id] || null;
    },
    
    // Hardcoded resources (same as before)
    resourceContents: {
        'therapy-info': {
            title: 'Ce este terapia?',
            content: `
                <p>Terapia, cunoscută și sub denumirea de psihoterapie sau consiliere, este un proces colaborativ între un terapeut și o persoană care caută sprijin pentru a aborda anumite probleme sau pentru a-și îmbunătăți starea de bine mentală și emoțională.</p>
                
                <h3>Cum funcționează terapia?</h3>
                <p>În cadrul terapiei, terapeutul creează un spațiu sigur și confidențial unde poți explora gândurile, emoțiile și comportamentele care te preocupă. Procesul implică de obicei:</p>
                <ul>
                    <li>Discuții deschise despre experiențele și provocările tale</li>
                    <li>Explorarea tiparelor de gândire și comportament</li>
                    <li>Dezvoltarea de strategii pentru a face față provocărilor</li>
                    <li>Stabilirea obiectivelor pentru schimbare și creștere personală</li>
                </ul>
                
                <h3>Beneficiile terapiei</h3>
                <p>Terapia poate oferi numeroase beneficii, inclusiv îmbunătățirea stării de bine emoționale și mentale, dezvoltarea abilităților de a face față stresului și provocărilor, îmbunătățirea relațiilor interpersonale, și multe altele.</p>
            `
        },
        'first-session': {
            title: 'Cum să te pregătești pentru prima ședință de terapie',
            content: `
                <p>Prima ședință de terapie poate fi o experiență plină de emoții - de la entuziasm la nervozitate. Iată câteva sfaturi pentru a te pregăti și a te simți mai confortabil.</p>
                
                <h3>Înainte de prima ședință</h3>
                <ul>
                    <li><strong>Reflectează asupra motivelor tale</strong> - Gândește-te la motivele pentru care cauți terapie și la ce speri să obții din acest proces</li>
                    <li><strong>Notează-ți întrebările</strong> - Pregătește orice întrebări ai despre procesul terapeutic</li>
                </ul>
            `
        },
        'childhood-trauma': {
            title: 'Gestionarea traumelor din copilărie',
            content: `
                <p>Traumele din copilărie pot avea un impact semnificativ asupra vieții adulte, influențând relațiile, stima de sine și sănătatea mentală generală.</p>
                
                <h3>Cum poate ajuta terapia?</h3>
                <p>Terapia oferă un cadru sigur pentru explorarea și procesarea traumelor din copilărie prin diverse abordări specializate.</p>
            `
        },
        'relaxation': {
            title: 'Tehnici de relaxare',
            content: `
                <p>Tehnicile de relaxare sunt instrumente valoroase pentru gestionarea stresului, anxietății și îmbunătățirea bunăstării generale.</p>
                
                <h3>Respirația profundă</h3>
                <p>Exercițiul 4-7-8 este o tehnică simplă și eficientă pentru relaxare rapidă.</p>
            `
        }
    }
};

