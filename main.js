import { createApp, ref, computed, watch, onMounted } from 'vue';

createApp({
    setup() {
        // State variables for ninjas
        const ninjas = ref([]);
        const isLoading = ref(true);

        // Fetch ninjas from API on page load
        onMounted(async () => {
            try {
                const response = await fetch('api.php');
                const data = await response.json();
                ninjas.value = data;
                isLoading.value = false;
            } catch (error) {
                console.error("Error fetching ninjas:", error);
                isLoading.value = false;
            }
        });

        const searchQuery = ref('');
        const showAddForm = ref(false);
        const hasPermission = ref(false);
        const passwordInput = ref('');
        const showPasswordModal = ref(false);
        const passwordError = ref('');
        
        // Create a new ninja template
        const newNinja = ref({
            name: '',
            village: 'Konoha',
            rank: 'Rang-C',
            age: null,
            height: '',
            hair: '',
            eyes: '',
            abilities: '',
            bounty: '',
            dangerLevel: 3,
            imageUrl: ''
        });
        
        // Add new state for viewing ninja details
        const selectedNinja = ref(null);
        const showNinjaDetail = ref(false);
        
        // Filter ninjas based on search
        const filteredNinjas = computed(() => {
            const query = searchQuery.value.toLowerCase();
            if (!query) return ninjas.value;
            
            return ninjas.value.filter(ninja => 
                ninja.name.toLowerCase().includes(query) || 
                ninja.village.toLowerCase().includes(query) ||
                ninja.abilities.toLowerCase().includes(query) ||
                ninja.rank.toLowerCase().includes(query)
            );
        });
        
        // Add a new ninja
        const addNinja = async () => {
            const ninja = { ...newNinja.value };
            
            try {
                const response = await fetch('api.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ninja: ninja,
                        password: 'naruto123'  // In real app, this would be handled more securely
                    }),
                });
                
                const result = await response.json();
                
                if (result.success) {
                    ninjas.value.push(result.ninja);
                    
                    // Reset form
                    newNinja.value = {
                        name: '',
                        village: 'Konoha',
                        rank: 'Rang-C',
                        age: null,
                        height: '',
                        hair: '',
                        eyes: '',
                        abilities: '',
                        bounty: '',
                        dangerLevel: 3,
                        imageUrl: ''
                    };
                    
                    showAddForm.value = false;
                } else {
                    alert('Erreur: ' + result.message);
                }
            } catch (error) {
                console.error("Error adding ninja:", error);
                alert('Une erreur est survenue lors de l\'ajout du ninja');
            }
        };
        
        // Remove a ninja
        const removeNinja = async (id) => {
            if (!hasPermission.value) {
                showPasswordModal.value = true;
                passwordInput.value = '';
                passwordError.value = '';
                // Store the ID to remove after authentication
                pendingDeleteId.value = id;
                return;
            }
            
            if (confirm('Êtes-vous sûr de vouloir supprimer ce ninja du Bingo Book ?')) {
                try {
                    const response = await fetch(`api.php`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: `id=${id}&password=naruto123`
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        ninjas.value = ninjas.value.filter(ninja => ninja.id !== id);
                    } else {
                        alert('Erreur: ' + result.message);
                    }
                } catch (error) {
                    console.error("Error removing ninja:", error);
                    alert('Une erreur est survenue lors de la suppression');
                }
            }
        };
        
        // Check permission
        const checkPermission = () => {
            // Simple password check - in a real app use proper authentication
            if (passwordInput.value === 'naruto123') {
                hasPermission.value = true;
                showPasswordModal.value = false;
                passwordError.value = '';
                
                // If there's a pending delete, process it
                if (pendingDeleteId.value) {
                    const idToDelete = pendingDeleteId.value;
                    pendingDeleteId.value = null;
                    removeNinja(idToDelete);
                } else {
                    // Otherwise show the add form
                    showAddForm.value = true;
                }
            } else {
                passwordError.value = 'Mot de passe invalide. Accès refusé.';
            }
        };
        
        // Open password modal
        const openPermissionModal = () => {
            if (hasPermission.value) {
                showAddForm.value = true;
            } else {
                showPasswordModal.value = true;
                passwordInput.value = '';
                passwordError.value = '';
                // Clear any pending delete when opening for add
                pendingDeleteId.value = null;
            }
        };
        
        // Add new function to show ninja details
        const viewNinjaDetails = (ninja) => {
            selectedNinja.value = ninja;
            showNinjaDetail.value = true;
        };
        
        // Add variable to track which ninja to delete after authentication
        const pendingDeleteId = ref(null);
        
        // Handle image upload
        const handleImageUpload = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    newNinja.value.imageUrl = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
        
        return {
            ninjas,
            isLoading,
            searchQuery,
            showAddForm,
            newNinja,
            filteredNinjas,
            addNinja,
            removeNinja,
            hasPermission,
            passwordInput,
            showPasswordModal,
            passwordError,
            checkPermission,
            openPermissionModal,
            pendingDeleteId,
            selectedNinja,
            showNinjaDetail,
            viewNinjaDetails,
            handleImageUpload
        };
    }
}).mount('#app');