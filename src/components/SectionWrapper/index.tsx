import React from "react";
import "./style.scss";

interface SectionWrapperProps {
  title: string;
  children: React.ReactNode;
  wrapperClass?: string;
  className?: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  title,
  children,
  wrapperClass = "",
  className = "",
}) => {
  return (
    <div className={`section-wrapper ${wrapperClass}`}>
      <h3>{title}</h3>
      <div className={`section-content ${className}`}>{children}</div>
    </div>
  );
};

export default SectionWrapper;
