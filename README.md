# FNAF 3D - Jogo Interativo 3D

Um jogo 3D interativo baseado em Five Nights at Freddy's, criado com **Three.js** e **JavaScript vanilla**. Explore um ambiente 3D totalmente interativo com movimentação livre, inimigos animatônicos e controles de câmera.

## 🎮 Características

- ✅ **Ambiente 3D Imersivo**: Salão completo com paredes, chão, teto e iluminação dinâmica
- ✅ **Movimento Livre**: Navegação em primeira pessoa com câmera controlada por mouse
- ✅ **Personagens Animatrônicos**: 3 inimigos FNAF com comportamento de patrulha e tracking
- ✅ **Sistema de Física**: Gravidade, pulo e detecção de colisão
- ✅ **HUD em Tempo Real**: Exibição de posição, rotação e velocidade
- ✅ **Menu de Pausa**: Sistema completo de pausa e reinicialização
- ✅ **Design Cyberpunk**: Estética visual com cores vibrantes e neón

## 🎯 Controles

| Tecla | Ação |
|-------|------|
| **W/A/S/D** | Movimento para frente, esquerda, trás, direita |
| **Mouse** | Olhar ao redor / Rotacionar câmera |
| **SPACE** | Pular |
| **SHIFT** | Correr (movimento mais rápido) |
| **SETAS** | Movimento alternativo |
| **ESC** | Pausa/Menu |
| **Click** | Ativar controle de mouse |

## 🚀 Como Jogar

1. **Abra no navegador**: 
   ```bash
   # Opção 1: Python
   python -m http.server 8000
   
   # Opção 2: Node.js (http-server)
   npx http-server
   
   # Opção 3: Abra diretamente no navegador
   # (alguns recursos podem não funcionar sem servidor)
   ```

2. **Acesse**: `http://localhost:8000`

3. **Clique na janela** para ativar o controle de mouse

4. **Explore o salão** e evite os animatônicos!

## 📁 Estrutura do Projeto

```
fnaf-3d-game/
├── index.html          # Página principal
├── style.css           # Estilos e tema cyberpunk
├── game.js             # Lógica principal do jogo
├── package.json        # Dependências
└── README.md           # Este arquivo
```

## 🛠️ Dependências

- **Three.js r128** - Renderização 3D (CDN)
- **Navegador Moderno** - Chrome, Firefox, Safari, Edge (com suporte WebGL)

## 📊 Especificações Técnicas

### Ambientes
- Salão 200x200 com paredes, teto e chão
- 4 Palcos decorativos distribuídos
- Iluminação com luz ambiental + direcional com sombras

### Personagem Jogável
- Câmera em primeira pessoa
- Velocidade padrão: 0.1 u/s
- Velocidade com Shift: 0.2 u/s
- Força de pulo: 0.15 u/s
- Sensibilidade de mouse: 0.003 rad/px

### Inimigos (Animatrônicos)
- 3 animatônicos diferentes
- Movimento de patrulha com trajetória circular
- Tracking visual do jogador
- Animação de piscada dos olhos

## 🎨 Customizações Possíveis

### Adicionar Novos Inimigos
```javascript
// Em createEnemies()
const enemy = createAnimatronic(x, y, z, index);
enemies.push(enemy);
```

### Modificar Velocidades
```javascript
CONFIG.MOVE_SPEED = 0.15;    // Mais rápido
CONFIG.RUN_SPEED = 0.25;
CONFIG.JUMP_FORCE = 0.2;
```

### Mudar Cores e Materiais
```javascript
const colors = [0xff0000, 0x00ff00, 0x0000ff];
```

## 🐛 Problemas Conhecidos

- Colisão com objetos é simplificada (sem sistema de colisão de caixa)
- Performance em dispositivos móveis pode ser limitada
- Sons não estão implementados (adicionar Web Audio API)

## 🔮 Próximas Funcionalidades

- [ ] Sistema de câmeras de segurança
- [ ] Sistema de sons e efeitos
- [ ] Mais inimigos e comportamentos
- [ ] Sistema de pontuação e objetivo
- [ ] Modo mobile com joystick virtual
- [ ] Shaders customizados
- [ ] Física mais realista

## 📝 Licença

MIT - Sinta-se livre para modificar e compartilhar!

## 👨‍💻 Desenvolvedor

Criado por **Glight58**

---

**Divirta-se explorando o salão assombrado!** 👻🎮
