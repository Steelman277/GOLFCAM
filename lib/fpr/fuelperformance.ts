'use server'
/**
 * Multiple Linear Regression using Least Squares Method in TypeScript
 * Formula: β = (XᵀX)⁻¹ Xᵀy
 */

type Matrix = number[][];
type Vector = number[];

/** Transpose of a matrix */
function transpose(matrix: Matrix): Matrix {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

/** Multiply two matrices */
function multiplyMatrices(a: Matrix, b: Matrix): Matrix {
    if (a[0].length !== b.length) {
        throw new Error("Matrix dimensions do not match for multiplication.");
    }
    return a.map(row =>
        b[0].map((_, colIndex) =>
            row.reduce((sum, val, i) => sum + val * b[i][colIndex], 0)
        )
    );
}

/** Multiply matrix and vector */
function multiplyMatrixVector(matrix: Matrix, vector: Vector): Vector {
    if (matrix[0].length !== vector.length) {
        throw new Error("Matrix and vector dimensions do not match.");
    }
    return matrix.map(row =>
        row.reduce((sum, val, i) => sum + val * vector[i], 0)
    );
}

/** Invert a matrix using Gaussian elimination */
function invertMatrix(matrix: Matrix): Matrix {
    const n = matrix.length;
    const identity = matrix.map((row, i) =>
        row.map((_, j) => (i === j ? 1 : 0))
    );
    const copy = matrix.map(row => [...row]);

    for (let i = 0; i < n; i++) {
        // Pivot
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(copy[k][i]) > Math.abs(copy[maxRow][i])) {
                maxRow = k;
            }
        }
        [copy[i], copy[maxRow]] = [copy[maxRow], copy[i]];
        [identity[i], identity[maxRow]] = [identity[maxRow], identity[i]];

        // Normalize pivot row
        const pivot = copy[i][i];
        if (pivot === 0) throw new Error("Matrix is singular and cannot be inverted.");
        for (let j = 0; j < n; j++) {
            copy[i][j] /= pivot;
            identity[i][j] /= pivot;
        }

        // Eliminate column
        for (let k = 0; k < n; k++) {
            if (k !== i) {
                const factor = copy[k][i];
                for (let j = 0; j < n; j++) {
                    copy[k][j] -= factor * copy[i][j];
                    identity[k][j] -= factor * identity[i][j];
                }
            }
        }
    }
    return identity;
}

/** Perform multiple linear regression */
export async function multipleLinearRegression(X: Matrix, y: Vector): Promise<Vector> {
    // Add intercept column of 1's
    const XwithIntercept = X.map(row => [1, ...row]);

    const XT = transpose(XwithIntercept);
    const XTX = multiplyMatrices(XT, XwithIntercept);
    const XTX_inv = invertMatrix(XTX);
    const XTy = multiplyMatrixVector(XT, y);

    return multiplyMatrixVector(XTX_inv, XTy); // β coefficients
}

