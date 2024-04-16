import { isValidArray } from '../common-utils';

test("isValidArray should return true", () => {
    const array = ["element1"];
    expect(isValidArray(array)).toBeTruthy();

    const array2 = [0];
    expect(isValidArray(array2)).toBeTruthy();

    const array3 = [{obj: "obj"}];
    expect(isValidArray(array3)).toBeTruthy();

    const array4 = ["", "element2"];
    expect(isValidArray(array4)).toBeTruthy();

    const array5 = [{}, "element2"];
    expect(isValidArray(array5)).toBeTruthy();
})

test("isValidArray should return false", () => {
    const array = [""];
    expect(isValidArray(array)).toBeFalsy();

    const array2 = [];
    expect(isValidArray(array2)).toBeFalsy();

    const array3 = ["      "];
    expect(isValidArray(array3)).toBeFalsy();

    const array4 = [{}];
    expect(isValidArray(array4)).toBeFalsy();
})