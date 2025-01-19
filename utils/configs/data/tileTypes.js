import { size } from '../size.js';

const TILE_TYPES = {
    swamp: {
        "LittleMushrooms": {
            id: 10,
            height: 2 * size.tils / 2.5,
            width: 2 * size.tils / 2.5,
            img: `src/terrain/swamp/decor/mushrooms.png`,
            type: "notColl",
            repeatTexture: null
        },
        "BigGrass1": {
            id: 11,
            height: 4 * size.tils / 2.5,
            width: 4 * size.tils / 2.5,
            img: `src/terrain/swamp/decor/bigGras1.png`,
            type: "notColl",
            repeatTexture: null
        },
        "LittleGrass1": {
            id: 12,
            height: 2 * size.tils / 2.5,
            width: 2 * size.tils / 2.5,
            img: `src/terrain/swamp/decor/littleGras1.png`,
            type: "notColl",
            repeatTexture: null
        },
        "LittleGrass2": {
            id: 13,
            height: 2 * size.tils / 2.7,
            width: 2 * size.tils / 2.7,
            img: `src/terrain/swamp/decor/littleGras2.png`,
            type: "notColl",
            repeatTexture: null
        },
        "LittleGrass3": {
            id: 14,
            height: 1 * size.tils,
            width: 1 * size.tils,
            img: `src/terrain/swamp/decor/littleGras3.png`,
            type: "notColl",
            repeatTexture: null,
            marginY: 1 * size.tils / 4
        },
        "LittleGrass4": {
            id: 15,
            height: 0.5 * size.tils,
            width: 1 * size.tils,
            img: `src/terrain/swamp/decor/littleGras4.png`,
            type: "notColl",
            repeatTexture: null,
            marginY: 1 * size.tils / 5
        },
        "Mushrooms": {
            id: 17,
            height: 200, 
            width: 200, 
            img: `src/terrain/swamp/decor/mushrooms.png`,
            type: "notColl", 
            repeatTexture: false
        },
        "MushroomLightBottom": {
            id: 18,
            height: 100,  // Ajustar la altura de la entidad
            width: 20,    // Ajustar el ancho de la entidad
            img: `src/terrain/swamp/decor/ilumination/mushBottom.png`, // Imagen de la base de la iluminación
            type: "notColl",
            repeatTexture: null,
            glowLeage:1,
        },
        "MushroomLightTop": {
            id: 19,
            height: 40,  // Ajustar la altura de la entidad
            width: 40,   // Ajustar el ancho de la entidad
            img: `src/terrain/swamp/decor/ilumination/mushTop.png`,    // Imagen de la parte superior de la iluminación
            type: "notColl",  // Puede tener un tipo diferente si corresponde
            repeatTexture: null,
            marginY: 35,  // Ajustar el margen para posicionar adecuadamente
            glow: true,     // Propiedad adicional para indicar que tiene un efecto de brillo
            glowLeage:2,
        },
        "glowUp1": {
            id: 19,
            height: 50,  // Ajustar la altura de la entidad
            width: 20,   // Ajustar el ancho de la entidad
            img: `src/terrain/swamp/decor/ilumination/glowUp1.png`,    // Imagen de la parte superior de la iluminación
            type: "notColl",  // Puede tener un tipo diferente si corresponde
            repeatTexture: null,
            marginY: 35,  // Ajustar el margen para posicionar adecuadamente
            glowUp: true,     // Propiedad adicional para indicar que tiene un efecto de brillo
        },
        "glowUp2": {
            id: 19,
            height: 50,  // Ajustar la altura de la entidad
            width: 20,   // Ajustar el ancho de la entidad
            img: `src/terrain/swamp/decor/ilumination/glowUp2.png`,    // Imagen de la parte superior de la iluminación
            type: "notColl",  // Puede tener un tipo diferente si corresponde
            repeatTexture: null,
            marginY: 35,  // Ajustar el margen para posicionar adecuadamente
            glowUp: true,     // Propiedad adicional para indicar que tiene un efecto de brillo
        },
        "glowUp3": {
            id: 19,
            height: 50,  // Ajustar la altura de la entidad
            width: 20,   // Ajustar el ancho de la entidad
            img: `src/terrain/swamp/decor/ilumination/glowUp3.png`,    // Imagen de la parte superior de la iluminación
            type: "notColl",  // Puede tener un tipo diferente si corresponde
            repeatTexture: null,
            marginY: 35,  // Ajustar el margen para posicionar adecuadamente
            glowUp: true,     // Propiedad adicional para indicar que tiene un efecto de brillo
        },
        "glowUp4": {
            id: 19,
            height: 50,  // Ajustar la altura de la entidad
            width: 20,   // Ajustar el ancho de la entidad
            img: `src/terrain/swamp/decor/ilumination/glowUp4.png`,    // Imagen de la parte superior de la iluminación
            type: "notColl",  // Puede tener un tipo diferente si corresponde
            repeatTexture: null,
            marginY: 35,  // Ajustar el margen para posicionar adecuadamente
            glowUp: true,     // Propiedad adicional para indicar que tiene un efecto de brillo
        }
    },
};

export { TILE_TYPES };