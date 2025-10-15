import React from "react";
import { useRegion } from "../../../state/RegionContext";

/**
// PUBLIC_INTERFACE
 * RegionFilter
 * Dropdown bound to global RegionContext; emits onChange as well.
 */
export default function RegionFilter({ value, onChange }) {
  const { region, setRegion } = useRegion();
  const current = value ?? region;

  const handle = (e) => {
    const v = e.target.value;
    setRegion(v);
    if (onChange) onChange(v);
  };

  return (
    <select className="input" value={current} onChange={handle} aria-label="Filter by region">
      <option>Global</option>
      <option>North America</option>
      <option>Europe</option>
      <option>Asia</option>
      <option>Oceania</option>
    </select>
  );
}
