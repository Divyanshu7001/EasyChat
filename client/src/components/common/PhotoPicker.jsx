import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

function PhotoPicker({ onChange }) {
  const [portalTarget, setPortalTarget] = useState(null);

  useEffect(() => {
    const target = document.getElementById("photo-picker-element");
    setPortalTarget(target);
  }, []);

  if (!portalTarget) return null;
  const PhotoPickerComponent = () => (
    <div className="flex gap-1 flex-col">
      <input
        id="photo-picker"
        hidden
        type="file"
        name="photo"
        onChange={onChange}
        className="bg-input-background text-start focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
      />
    </div>
  );

  return ReactDOM.createPortal(<PhotoPickerComponent />, portalTarget);
}

export default PhotoPicker;
