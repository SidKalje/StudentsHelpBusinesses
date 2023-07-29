import React from "react";
import AsyncSelect from "react-select/async";

function loadOptions(inputValue: any, callback: any) {
  // Fetch the options from your server/API
  // This is a mock function, replace it with actual API call
  setTimeout(() => {
    callback([
      { value: "New York", label: "New York" },
      { value: "Los Angeles", label: "Los Angeles" },
      { value: "Chicago", label: "Chicago" },
      { value: "Houston", label: "Houston" },
      { value: "Phoenix", label: "Phoenix" },
      // ... add more cities here
    ]);
  }, 1000);
}

function CityDropdown() {
  const [selectedCity, setSelectedCity] = React.useState(null);

  const handleChange = (selectedOption: React.SetStateAction<null>) => {
    setSelectedCity(selectedOption);
    console.log(`Option selected:`, selectedOption);
  };

  return (
    <div className="CityDropdown">
      <AsyncSelect
        cacheOptions
        defaultOptions
        loadOptions={loadOptions}
        onInputChange={handleChange}
      />
    </div>
  );
}

export default CityDropdown;
