---
marp: true
theme: uncover
paginate: true
size: 16:9
style: |
  :root {
    --scale: 1.4;
  }
  section {
    font-size: calc(24px * var(--scale));
  }
  h1 {
    font-size: calc(48px * var(--scale));
  }
  h2 {
    font-size: calc(38px * var(--scale));
  }
  h3 {
    font-size: calc(30px * var(--scale));
  }
  ul, ol {
    font-size: calc(22px * var(--scale));
  }
---

# Praktyczna realizacja algorytmów renderowania wolumetrycznego

Mateusz Mrowiec

---

## 1. Wstęp

### Czym jest renderowanie wolumetryczne?

- Techniki wizualizacji danych próbkowanych w 3D (wokseli).
- W przeciwieństwie do tradycyjnego renderowania (powierzchnie/trójkąty), tutaj ważna jest **wewnętrzna struktura**.
- Zastosowania: medycyna (CT, MRI), symulacje fizyczne, wizualizacja danych naukowych.

---

## 2. Wykorzystane technologie

- **Język:** TypeScript (statyczne typowanie, łatwość debugowania).
- **API Graficzne:** WebGL 2 (szerokie wsparcie w przeglądarkach, obsługa tekstur 3D).
- **Narzędzia i Biblioteki:**
  - **Vite:** Szybki serwer deweloperski, HMR.
  - **gl-matrix:** Operacje na wektorach i macierzach.
  - **3d-game-engine-canvas:** Biblioteka pomocnicza (import .obj, itp.).

---

## 3. Reprezentacja danych wolumetrycznych

- **Struktura:** Trójwymiarowa tablica wartości (wokseli).
- **Format w projekcie:**
  - `Uint8Array` - 8-bitowa precyzja (0-255).
  - Tekstura 3D w WebGL: `gl.R8` (jeden kanał - czerwony).
- **Źródło danych:** _Open SciVis Datasets_ (skany CT).
- **Import:** Obsługa plików RAW.

---

## 4. Zaimplementowane algorytmy

W ramach projektu zrealizowano trzy podejścia:

1. **Marching Cubes** (Pośrednie - generowanie geometrii)
2. **Direct Texture Based Volume Rendering** (Bezpośrednie - płaszczyzny)
3. **Volume Ray Casting** (Bezpośrednie - śledzenie promieni)

---

### 4.1. Marching Cubes - Opis

- **Zasada działania:** Generuje siatkę trójkątów (izopowierzchnię) dla zadanej wartości progowej.
- **Algorytm:**
  - Dzieli przestrzeń na wirtualne sześciany.
  - Sprawdza wartości w wierzchołkach sześcianu względem progu.
  - Wybiera konfigurację trójkątów z tablicy LUT (Look-Up Table).
  - Interpoluje pozycje wierzchołków na krawędziach sześcianu.
- **Cechy:**
  - Tworzy tradycyjną geometrię.
  - Brak wglądu w głąb (tylko skorupa).
  - Kosztowne obliczenia na CPU w JS/TS.

---

### 4.1. Marching Cubes - Konfiguracje LUT

<img src="latex/imgs/MarchingCubes.png" width="600"/>

15 przykładowych konfiguracji ułożenia trójkątów wewnątrz kostki.

---

### 4.2. Direct Texture Based - Opis

- **Zasada działania:** Wyświetlanie serii półprzezroczystych płaszczyzn (slices) próbkujących teksturę 3D.
- **Algorytm:**
  - Generowanie płaszczyzn prostopadłych do wektora patrzenia kamery (_view-aligned slices_).
  - Renderowanie od tyłu do przodu (_back-to-front_).
  - Mieszanie kolorów (_alpha blending_).
- **Cechy:**
  - Prosty w implementacji.
  - Jakość zależy od liczby płaszczyzn.
  - Artefakty przy małej liczbie próbek.

---

### 4.2. Direct Texture Based - View-Aligned Slices

<img src="latex/imgs/TextureBased_slices.jpg" width="500" />

Schemat generowania płaszczyzn prostopadłych do kierunku patrzenia kamery.

---

### 4.3. Volume Ray Casting - Opis

- **Zasada działania:** Obliczanie koloru piksela poprzez śledzenie promienia przechodzącego przez objętość.
- **Algorytm:**
  1. Wyznaczenie promienia dla piksela.
  2. Kroczenie wzdłuż promienia i próbkowanie wolumenu.
  3. Akumulacja koloru i nieprzezroczystości.
- **Tryby:**
  - _Front-to-back blending_ (standardowy).
  - _Maximum Intensity Projection (MIP)_ (tylko wartość maksymalna).
- **Cechy:**
  - Najwyższa jakość.
  - Duże obciążenie GPU.

---

## 5. Live Demo

_(Miejsce na prezentację działającej aplikacji)_

- Prezentacja interfejsu użytkownika.
- Zmiana algorytmów w czasie rzeczywistym.
- Manipulacja parametrami (progi, funkcje transferu).

---

## 6. Podsumowanie

- **Wnioski:**
  - WebGL 2 wystarcza do interaktywnej wizualizacji średnich danych.
  - **Ray Casting** oferuje najlepszą jakość wizualną.
  - **Marching Cubes** na CPU w przeglądarce jest wąskim gardłem.
- **Ograniczenia:**
  - Brak _Compute Shaders_ w WebGL 2 utrudnia optymalizację (np. MC na GPU).
- **Przyszłość:**
  - Migracja do **WebGPU** (Compute Shaders, lepsza wydajność).
