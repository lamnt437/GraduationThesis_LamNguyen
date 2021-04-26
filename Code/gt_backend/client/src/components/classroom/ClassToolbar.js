import React from 'react';

export const ClassToolbar = () => {
  return (
    <div class='d-flex align-items-center'>
      <div class='center justify-content-between'>
        <div class='MuiFormControl-root MuiTextField-root'>
          <div class='MuiInputBase-root MuiOutlinedInput-root MuiInputBase-formControl MuiInputBase-adornedEnd MuiOutlinedInput-adornedEnd MuiInputBase-marginDense MuiOutlinedInput-marginDense'>
            <input
              aria-invalid='false'
              placeholder='Nhập tên lớp học để tìm kiếm...'
              type='text'
              class='MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedEnd MuiOutlinedInput-inputAdornedEnd MuiInputBase-inputMarginDense MuiOutlinedInput-inputMarginDense'
              value=''
            />
            <div class='MuiInputAdornment-root MuiInputAdornment-positionStart MuiInputAdornment-marginDense'>
              {/* <svg
                class='MuiSvgIcon-root'
                focusable='false'
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <path d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'></path>
              </svg> */}
            </div>
            <fieldset
              aria-hidden='true'
              class='jss20 MuiOutlinedInput-notchedOutline'
            >
              <legend class='jss21'>
                <span>​</span>
              </legend>
            </fieldset>
          </div>
        </div>
        <div class='MuiInputBase-root MuiOutlinedInput-root MuiInputBase-marginDense MuiOutlinedInput-marginDense'>
          <div
            class='MuiSelect-root MuiSelect-select MuiSelect-selectMenu MuiSelect-outlined MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputMarginDense MuiOutlinedInput-inputMarginDense'
            tabindex='0'
            role='button'
            aria-haspopup='listbox'
          >
            Mới nhất
          </div>
          <input
            aria-hidden='true'
            tabindex='-1'
            class='MuiSelect-nativeInput'
            value='Mới nhất'
          />
          {/* <svg
            class='MuiSvgIcon-root MuiSelect-icon MuiSelect-iconOutlined'
            focusable='false'
            viewBox='0 0 24 24'
            aria-hidden='true'
          >
            <path d='M7 10l5 5 5-5z'></path>
          </svg> */}
          <fieldset
            aria-hidden='true'
            class='jss20 MuiOutlinedInput-notchedOutline'
          >
            <legend class='jss21'>
              <span>​</span>
            </legend>
          </fieldset>
        </div>
      </div>
      <div class='MuiBox-root jss24'>
        <button
          class='MuiButtonBase-root MuiButton-root jss25 MuiButton-contained MuiButton-containedPrimary MuiButton-containedSizeLarge MuiButton-sizeLarge MuiButton-disableElevation'
          tabindex='0'
          type='button'
        >
          <span class='MuiButton-label'>
            <div class='MuiBox-root jss27'>
              {/* <svg
                class='MuiSvgIcon-root'
                focusable='false'
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'></path>
              </svg> */}
            </div>
            <p class='MuiTypography-root semi-bold MuiTypography-body1'>
              Tạo lớp học
            </p>
          </span>
        </button>
      </div>
    </div>
  );
};

export default ClassToolbar;
