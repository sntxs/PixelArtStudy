const canvas = document.querySelector(".canvas");
const inputSize = document.querySelector(".input-size");
const inputColor = document.querySelector(".input-color");
const usedColors = document.querySelector(".used-colors");
const buttonSave = document.querySelector(".button-save");
const colResize = document.querySelector(".resizes");
const main = document.querySelector("main");
const clear = document.querySelector(".button-clear");
const modal = document.getElementById("modal");
const closeButton = document.querySelector(".close-button");

let minCanvas = 4;
let isResizing = false
let isPainting = false;


const createElement = (tag, className = "") => {
    const element = document.createElement(tag);
    element.className = className;
    return element;
};

const createPixel = () => {
    const pixel = createElement("div", "pixel");

    pixel.addEventListener("mousemove", () => {
        if (isPainting) {
            pixel.style.backgroundColor = inputColor.value;
        }
    });

    return pixel;
};

const loadCanvas = () => {
    const length = inputSize.value;
    canvas.innerHTML = "";

    for (let i = 0; i < length; i += 1) {
        const row = createElement("div", "row");

        for (let j = 0; j < length; j += 1) {
            const pixel = createPixel();

            pixel.addEventListener("mousedown", () => {
                pixel.style.backgroundColor = inputColor.value;
            });

            clear.addEventListener("mousedown", () => {
                pixel.style.backgroundColor = "";
            });

            row.append(pixel);
        }

        canvas.append(row);
    }
};

const updateCanvasSize = () => {
    if (inputSize.value >= minCanvas) {
        loadCanvas();
    } else {
        showModal();
    }
};

const showModal = () => {
    modal.style.display = "block";
};

const closeModal = () => {
    location.reload(true);
    modal.style.display = "none";
};

const changeColor = () => {
    const button = createElement("button", "button-color");
    const currentColor = inputColor.value;

    button.style.backgroundColor = currentColor;
    button.setAttribute("data-color", currentColor);
    button.addEventListener("click", () => {
        inputColor.value = currentColor;
    });

    const savedColors = Array.from(usedColors.children);

    const check = (btn) => btn.getAttribute("data-color") != currentColor;

    if (savedColors.every(check)) {
        usedColors.append(button)
    }

};

const resizeCanvas = (cursorPositionX) => {
    if (!isResizing) return;

    const canvasOffset = canvas.getBoundingClientRect().left;
    const width = `${cursorPositionX - canvasOffset - 20}px`;

    canvas.style.maxWidth = width;
    colResize.style.height = width;
}

const saveCanvas = () => {
    html2canvas(canvas, {
        onrendered: (image) => {
            const img = image.toDataURL("image/png");
            const link = createElement("a");

            link.href = img;
            link.download = "pixelStudyResult.png";

            link.click();


        },
    });
};

window.addEventListener("click", (event) => {
    if (event.target == modal) {
        closeModal();
    }
});

canvas.addEventListener("mousedown", () => (isPainting = true));
canvas.addEventListener("mouseup", () => (isPainting = false));


inputSize.addEventListener("change", updateCanvasSize);
inputColor.addEventListener("change", changeColor);

colResize.addEventListener("mousedown", () => (isResizing = true));

main.addEventListener("mouseup", () => (isResizing = false));
main.addEventListener("mousemove", ( { clientX }) => resizeCanvas(clientX));

closeButton.addEventListener("click", closeModal);

buttonSave.addEventListener("click", saveCanvas);

loadCanvas();
