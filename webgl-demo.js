// Initialize WebGL context
const canvas = document.getElementById('gl-canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

// Vertex shader program
const vertexShaderSrc = `
    attribute vec2 aPosition;
    void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
`;

// Fragment shader program
const fragmentShaderSrc = `
    precision mediump float;
    uniform vec4 uColor;
    void main() {
        gl_FragColor = uColor;
    }
`;

// Compile shader function
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// Create program and link shaders
function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Error linking program:', gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}

// Initialize shaders
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);
const program = createProgram(gl, vertexShader, fragmentShader);

gl.useProgram(program);

// Get attribute and uniform locations
const aPosition = gl.getAttribLocation(program, 'aPosition');
const uColor = gl.getUniformLocation(program, 'uColor');

// Define city skyline with varied heights and shapes
const cityVertices = new Float32Array([
    // Building 1 with windows (made of multiple triangles)
    -0.9, -0.5,  -0.8, -0.5,  -0.8, 0.2,
    -0.9, -0.5,  -0.8, 0.2,   -0.9, 0.2,

    // Building 2 taller
    -0.7, -0.5,  -0.6, -0.5,  -0.6, 0.5,
    -0.7, -0.5,  -0.6, 0.5,   -0.7, 0.5,

    // Building 3 wider
    -0.5, -0.5,  -0.3, -0.5,  -0.3, 0.3,
    -0.5, -0.5,  -0.3, 0.3,   -0.5, 0.3,

    // Building 4 with windows
    0.0, -0.5,   0.2, -0.5,   0.2, 0.4,
    0.0, -0.5,   0.2, 0.4,    0.0, 0.4,
]);

// Create buffer for city skyline
const cityBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, cityBuffer);
gl.bufferData(gl.ARRAY_BUFFER, cityVertices, gl.STATIC_DRAW);

// Define graph vertices with rise and fall
const graphVertices = new Float32Array([
    -0.9, 0.6,   -0.5, 0.8,  // Rise
    -0.5, 0.8,   0.0, 0.4,   // Fall
    0.0, 0.4,    0.5, 0.7,   // Rise
    0.5, 0.7,    0.9, 0.3    // Fall
]);

// Create buffer for graph
const graphBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, graphBuffer);
gl.bufferData(gl.ARRAY_BUFFER, graphVertices, gl.STATIC_DRAW);

// Function to draw the city skyline
function drawCity() {
    gl.bindBuffer(gl.ARRAY_BUFFER, cityBuffer);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    gl.uniform4f(uColor, 0.2, 0.2, 0.2, 1.0); // Dark gray for buildings
    gl.drawArrays(gl.TRIANGLES, 0, cityVertices.length / 2);
}

// Function to draw graph in the sky
function drawGraph() {
    gl.bindBuffer(gl.ARRAY_BUFFER, graphBuffer);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    gl.uniform4f(uColor, 0.0, 1.0, 0.0, 1.0); // Green for graph line
    gl.drawArrays(gl.LINES, 0, graphVertices.length / 2);
}

// Clear canvas and draw scene
function render() {
    gl.clearColor(0.6, 0.8, 1.0, 1.0); // Light blue sky
    gl.clear(gl.COLOR_BUFFER_BIT);

    drawCity();
    drawGraph();
}

render();
