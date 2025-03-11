import { createApp, ref, computed, watch } from 'vue';

createApp({
    setup() {
        // Load ninjas from localStorage or use sample data
        const storedNinjas = localStorage.getItem('ninjas');
        const ninjas = ref(storedNinjas ? JSON.parse(storedNinjas) : [
            {
                id: 1,
                name: "Kakashi Hatake",
                village: "Konoha",
                rank: "Jonin",
                age: 31,
                height: "181 cm",
                hair: "Argenté",
                eyes: "Noir, Sharingan (gauche)",
                abilities: "Ninja Copieur, Éclair Pourfendeur, 1000+ jutsu",
                bounty: "3,000,000 ryō",
                dangerLevel: 4
            },
            {
                id: 2,
                name: "Gaara",
                village: "Suna",
                rank: "Kage",
                age: 19,
                height: "166 cm",
                hair: "Rouge",
                eyes: "Turquoise",
                abilities: "Contrôle du Sable, Bouclier de Sable, Cercueil du Désert",
                bounty: "5,000,000 ryō",
                dangerLevel: 5
            },
            {
                id: 3,
                name: "Itachi Uchiha",
                village: "Nukenin",
                rank: "Rang-S",
                age: 21,
                height: "178 cm",
                hair: "Noir",
                eyes: "Noir, Sharingan, Mangekyo Sharingan",
                abilities: "Sharingan, Genjutsu, Amaterasu, Tsukuyomi",
                bounty: "10,000,000 ryō",
                dangerLevel: 5
            }
        ]);

        // Watch for changes in the ninjas array and save to localStorage
        watch(ninjas, (newValue) => {
            localStorage.setItem('ninjas', JSON.stringify(newValue));
        }, { deep: true });

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
        const addNinja = () => {
            const ninja = { ...newNinja.value };
            ninja.id = Date.now(); // Simple unique ID
            
            ninjas.value.push(ninja);
            
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
        };
        
        // Remove a ninja
        const removeNinja = (id) => {
            if (!hasPermission.value) {
                showPasswordModal.value = true;
                passwordInput.value = '';
                passwordError.value = '';
                // Store the ID to remove after authentication
                pendingDeleteId.value = id;
                return;
            }
            
            if (confirm('Êtes-vous sûr de vouloir supprimer ce ninja du Bingo Book ?')) {
                ninjas.value = ninjas.value.filter(ninja => ninja.id !== id);
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