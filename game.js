// ============================================
// FNAF 3D - Sistema de Jogo Interativo 3D
// ============================================

// Configurações Globais
const CONFIG = {
    MOVE_SPEED: 0.1,
    RUN_SPEED: 0.2,
    JUMP_FORCE: 0.15,
    MOUSE_SENSITIVITY: 0.003,
    GRAVITY: -0.015,
    GROUND_LEVEL: 0
};

// Estado do Jogo
const gameState = {
    isPaused: false,
    isRunning: false,
    isJumping: false,
    velocity: { x: 0, y: 0, z: 0 },
    position: { x: 0, y: 2, z: 0 },
    rotation: { x: 0, y: 0 },
    speed: 0
};

// Input Handler
const inputHandler = {
    keys: {},
    mouse: { x: 0, y: 0 },
    locked: false
};

// ============================================
// THREE.JS SETUP
// ============================================

let scene, camera, renderer;
let ground, player, enemies = [];
let clock = new THREE.Clock();

function initThreeJS() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    scene.fog = new THREE.Fog(0x1a1a2e, 100, 500);

    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 2, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('gameCanvas'),
        antialias: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    scene.add(directionalLight);

    // Ground
    createGround();

    // Ambiente
    createEnvironment();

    // Jogador (primeira pessoa - câmera)
    setupPlayerCamera();

    // Inimigos FNAF
    createEnemies();

    // Listeners
    setupEventListeners();
}

function createGround() {
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x444444,
        roughness: 0.8,
        metalness: 0.2
    });
    ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
}

function createEnvironment() {
    // Paredes do salão
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a3e,
        roughness: 0.7
    });

    // Parede frontal
    const frontWall = new THREE.Mesh(new THREE.BoxGeometry(200, 20, 2), wallMaterial);
    frontWall.position.z = -100;
    frontWall.castShadow = true;
    scene.add(frontWall);

    // Parede traseira
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(200, 20, 2), wallMaterial);
    backWall.position.z = 100;
    backWall.castShadow = true;
    scene.add(backWall);

    // Parede esquerda
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(2, 20, 200), wallMaterial);
    leftWall.position.x = -100;
    leftWall.castShadow = true;
    scene.add(leftWall);

    // Parede direita
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(2, 20, 200), wallMaterial);
    rightWall.position.x = 100;
    rightWall.castShadow = true;
    scene.add(rightWall);

    // Teto
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), wallMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 20;
    ceiling.receiveShadow = true;
    scene.add(ceiling);

    // Objetos decorativos (palcos)
    createStage(0, 0, -50);
    createStage(0, 0, 50);
    createStage(-40, 0, 0);
    createStage(40, 0, 0);
}

function createStage(x, y, z) {
    const stageMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b0000,
        metalness: 0.8,
        roughness: 0.2
    });

    const stageBase = new THREE.Mesh(new THREE.BoxGeometry(20, 1, 20), stageMaterial);
    stageBase.position.set(x, y, z);
    stageBase.castShadow = true;
    scene.add(stageBase);

    // Estrutura do palco
    const stageBack = new THREE.Mesh(new THREE.BoxGeometry(20, 15, 2), stageMaterial);
    stageBack.position.set(x, y + 8, z - 10);
    stageBack.castShadow = true;
    scene.add(stageBack);
}

function setupPlayerCamera() {
    // A câmera serve como o jogador em primeira pessoa
    player = {
        position: new THREE.Vector3(0, 2, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        isGrounded: true
    };
}

function createEnemies() {
    // Cria 3 inimigos tipo FNAF
    const enemyPositions = [
        { x: -30, z: -40 },
        { x: 30, z: 40 },
        { x: 0, z: 0 }
    ];

    enemyPositions.forEach((pos, index) => {
        const enemy = createAnimatronic(pos.x, 2, pos.z, index);
        enemies.push(enemy);
    });
}

function createAnimatronic(x, y, z, index) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const colors = [0xff0000, 0xffa500, 0xffff00];
    const color = colors[index % colors.length];

    // Corpo
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.6,
        roughness: 0.3
    });

    const body = new THREE.Mesh(new THREE.BoxGeometry(2, 4, 2), bodyMaterial);
    body.castShadow = true;
    group.add(body);

    // Cabeça
    const head = new THREE.Mesh(new THREE.BoxGeometry(2, 2.5, 2), bodyMaterial);
    head.position.y = 3;
    head.castShadow = true;
    group.add(head);

    // Olhos
    const eyeMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x00ff00
    });
    
    const eye1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), eyeMaterial);
    eye1.position.set(-0.5, 3.5, 1.2);
    group.add(eye1);

    const eye2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), eyeMaterial);
    eye2.position.set(0.5, 3.5, 1.2);
    group.add(eye2);

    // Braços
    createAnimaLimb(group, -1.5, 2, 0, 1);
    createAnimaLimb(group, 1.5, 2, 0, 1);

    scene.add(group);

    return {
        mesh: group,
        position: { x, y, z },
        angle: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.02,
        lookAtPlayer: true
    };
}

function createAnimaLimb(parent, x, y, z, length) {
    const limbMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.5
    });

    const limb = new THREE.Mesh(new THREE.BoxGeometry(0.5, length * 2, 0.5), limbMaterial);
    limb.position.set(x, y - length, z);
    limb.castShadow = true;
    parent.add(limb);
}

// ============================================
// INPUT HANDLING
// ============================================

function setupEventListeners() {
    // Keyboard
    window.addEventListener('keydown', (e) => {
        inputHandler.keys[e.key.toLowerCase()] = true;
        
        if (e.key === 'Escape') {
            togglePause();
        }
    });

    window.addEventListener('keyup', (e) => {
        inputHandler.keys[e.key.toLowerCase()] = false;
    });

    // Mouse
    document.addEventListener('click', () => {
        if (renderer.domElement.requestPointerLock) {
            renderer.domElement.requestPointerLock();
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (document.pointerLockElement === renderer.domElement) {
            gameState.rotation.y -= e.movementX * CONFIG.MOUSE_SENSITIVITY;
            gameState.rotation.x -= e.movementY * CONFIG.MOUSE_SENSITIVITY;
            
            // Limita rotação vertical
            gameState.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, gameState.rotation.x));
        }
    });

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ============================================
// GAME LOGIC
// ============================================

function updatePlayerMovement() {
    if (gameState.isPaused) return;

    const moveSpeed = inputHandler.keys['shift'] ? CONFIG.RUN_SPEED : CONFIG.MOVE_SPEED;
    const direction = new THREE.Vector3();

    if (inputHandler.keys['w'] || inputHandler.keys['arrowup']) {
        direction.z -= Math.cos(gameState.rotation.y);
        direction.x -= Math.sin(gameState.rotation.y);
    }
    if (inputHandler.keys['s'] || inputHandler.keys['arrowdown']) {
        direction.z += Math.cos(gameState.rotation.y);
        direction.x += Math.sin(gameState.rotation.y);
    }
    if (inputHandler.keys['a'] || inputHandler.keys['arrowleft']) {
        direction.z -= Math.sin(gameState.rotation.y);
        direction.x += Math.cos(gameState.rotation.y);
    }
    if (inputHandler.keys['d'] || inputHandler.keys['arrowright']) {
        direction.z += Math.sin(gameState.rotation.y);
        direction.x -= Math.cos(gameState.rotation.y);
    }

    direction.normalize();
    direction.multiplyScalar(moveSpeed);

    player.velocity.x = direction.x;
    player.velocity.z = direction.z;

    // Pulo
    if ((inputHandler.keys[' '] || inputHandler.keys['space']) && player.isGrounded) {
        player.velocity.y = CONFIG.JUMP_FORCE;
        player.isGrounded = false;
    }

    // Gravidade
    player.velocity.y += CONFIG.GRAVITY;

    // Atualiza posição
    player.position.add(player.velocity);

    // Colisão com chão
    if (player.position.y <= CONFIG.GROUND_LEVEL + 0.5) {
        player.position.y = CONFIG.GROUND_LEVEL + 0.5;
        player.velocity.y = 0;
        player.isGrounded = true;
    }

    // Limites do mapa
    player.position.x = Math.max(-95, Math.min(95, player.position.x));
    player.position.z = Math.max(-95, Math.min(95, player.position.z));

    // Atualiza câmera
    camera.position.copy(player.position);
    camera.rotation.order = 'YXZ';
    camera.rotation.y = gameState.rotation.y;
    camera.rotation.x = gameState.rotation.x;

    // Calcula velocidade
    gameState.speed = direction.length() / moveSpeed;
}

function updateEnemies() {
    enemies.forEach((enemy) => {
        // Movimento padrão
        enemy.angle += enemy.speed;
        const newX = enemy.position.x + Math.cos(enemy.angle) * 0.1;
        const newZ = enemy.position.z + Math.sin(enemy.angle) * 0.1;

        enemy.mesh.position.x = newX;
        enemy.mesh.position.z = newZ;

        // Olha para o jogador
        if (enemy.lookAtPlayer) {
            const direction = new THREE.Vector3(
                player.position.x - enemy.mesh.position.x,
                0,
                player.position.z - enemy.mesh.position.z
            );
            enemy.mesh.lookAt(
                player.position.x,
                enemy.mesh.position.y + 1,
                player.position.z
            );
        }

        // Pisca os olhos aleatoriamente
        enemy.mesh.children.forEach((child) => {
            if (child.geometry && child.geometry.type === 'SphereGeometry') {
                if (Math.random() < 0.01) {
                    child.scale.y = child.scale.y === 1 ? 0.1 : 1;
                }
            }
        });
    });
}

function updateHUD() {
    document.getElementById('positionDisplay').textContent = 
        `X: ${player.position.x.toFixed(1)} | Y: ${player.position.y.toFixed(1)} | Z: ${player.position.z.toFixed(1)}`;
    
    document.getElementById('cameraDisplay').textContent = 
        `Rotação: ${(gameState.rotation.y * 180 / Math.PI).toFixed(0)}°`;
    
    document.getElementById('speedDisplay').textContent = 
        `${(gameState.speed * 10).toFixed(1)} m/s`;
}

// ============================================
// PAUSE/RESUME
// ============================================

function togglePause() {
    gameState.isPaused = !gameState.isPaused;
    document.getElementById('menu').classList.toggle('hidden');
}

function resumeGame() {
    gameState.isPaused = false;
    document.getElementById('menu').classList.add('hidden');
    renderer.domElement.requestPointerLock();
}

function restartGame() {
    player.position.set(0, 2, 0);
    player.velocity.set(0, 0, 0);
    gameState.rotation.set(0, 0);
    gameState.isPaused = false;
    document.getElementById('menu').classList.add('hidden');
}

// ============================================
// GAME LOOP
// ============================================

function animate() {
    requestAnimationFrame(animate);

    updatePlayerMovement();
    updateEnemies();
    updateHUD();

    renderer.render(scene, camera);
}

// ============================================
// INICIALIZAÇÃO
// ============================================

window.addEventListener('load', () => {
    initThreeJS();
    animate();
});
