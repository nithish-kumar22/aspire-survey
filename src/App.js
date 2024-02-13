import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const App = () => {
  const MultipleChoiceComponent = () => {
    const [optionComponent, setOptionsComponent] = useState([]);

    const handleCreateOption = (component) => {
      setOptionsComponent((prevComponents) => [...prevComponents, component]);
    };

    const OptionComponent = ({ index, text }) => {
      const addOptionAtNewPos = () => {
        console.log(index);
        const temp = [
          ...optionComponent.slice(0, index),
          <OptionComponent index={index} text="Newly added" />,
          ...optionComponent.slice(index),
        ];

        setOptionsComponent(temp);
      };
      return (
        <div key={index} style={{ display: "flex", flexDirection: "row" }}>
          <input className="option-name" placeholder={text} />
          <div onClick={() => addOptionAtNewPos()} className="add-button">
            <div className="plus-btn1" />
            <div className="plus-btn2" />
          </div>
        </div>
      );
    };

    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    return (
      <div className="question-div">
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            className="question-name-input"
            placeholder="Enter your question here.."
          />
        </div>
        <div>
          {optionComponent.map((component, index) => (
            <div key={index}>
              <OptionComponent index={index} text="Enter.." />
            </div>
          ))}
        </div>
        <div
          className="create-new-option"
          onClick={() =>
            handleCreateOption(
              <OptionComponent
                index={optionComponent.length}
                text="Added last.."
              />
            )
          }
        >
          <p>Create New Option</p>
        </div>
      </div>
    );
  };

  const StarRating = () => {
    const [hoveredIndex, setHoveredIndex] = useState(-1);
    const [clickedIndex, setClickedIndex] = useState(-1);

    const handleMouseEnter = (index) => {
      if (clickedIndex === -1) {
        setHoveredIndex(index);
      }
    };

    const handleRatingClick = (index) => {
      setClickedIndex(index);
      setHoveredIndex(-1);
    };

    const handleMouseLeave = () => {
      setHoveredIndex(-1);
    };
    return (
      <div className="question-div">
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <input
            type="text"
            className="question-name-input"
            placeholder="Enter your question here.."
          />
          <div style={{ display: "flex", flexDirection: "row", marginTop: 20 }}>
            {[1, 2, 3, 4, 5].map((item, index) => (
              <div
                style={{
                  width: 20,
                  height: 20,
                  border: "1px solid black",
                  margin: 10,
                  cursor: "pointer",
                  backgroundColor:
                    index <= clickedIndex
                      ? "lightblue"
                      : index <= hoveredIndex
                      ? "lightgrey"
                      : "white",
                }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleRatingClick(index)}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const DropDown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [optionName, setOptionName] = useState("");
    const wrapperRef = useRef(null);

    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };

    const [dropdownOptions, setDropdownOptions] = useState([]);

    const handleChange = (event) => {
      setOptionName(event.target.value);
    };

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("click", handleClickOutside);

      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }, []);
    return (
      <div className="question-div">
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <input
            type="text"
            className="question-name-input"
            placeholder="Enter your question here.."
          />
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div className="dropdown">
              <button className="dropdown-toggle" onClick={toggleDropdown}>
                Choose
              </button>
              {isOpen && (
                <div className="dropdown-content">
                  {dropdownOptions.map((item, index) => (
                    <p>{item.option}</p>
                  ))}
                </div>
              )}
            </div>
            <input
              className="option-name"
              value={optionName}
              placeholder="Dropdown option"
              onChange={handleChange}
            />
            <div
              className="add-button"
              onClick={() => {
                const newOptions = [...dropdownOptions, { option: optionName }];
                setDropdownOptions(newOptions);
                setOptionName("");
              }}
            >
              <div className="plus-btn1" />
              <div className="plus-btn2" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const [questionComponents, setQuestionComponents] = useState([]);
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClick = (component) => {
    setQuestionComponents((prevComponents) => [...prevComponents, component]);
  };

  const questionTypes = [
    {
      questionTypeName: "Multiple Choice",
      component: <MultipleChoiceComponent />,
    },
    {
      questionTypeName: "DropDown",
      component: <DropDown />,
    },
    {
      questionTypeName: "Star Rating",
      component: <StarRating />,
    },
    {
      questionTypeName: "Short Answer",
    },
    {
      questionTypeName: "Long Answer",
    },
  ];

  let text = "Thriving marketplace survey";
  let delay = 100;
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, delay]);

  const handleDragStart = (event, index) => {
    event.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData("text/plain");
    const draggedIndex = parseInt(data, 10);
    console.log(draggedIndex);
    handleClick(questionTypes[draggedIndex].component);

    // event.target.appendChild(draggedElement);
  };

  return (
    <div className="App-container">
      <header>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <h1 style={{ color: "#2961B6" }}>Aspire</h1>
            <h1 style={{ marginLeft: 15 }}>{currentText}</h1>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              position: "absolute",
              right: "2rem",
              backgroundColor: "rgba(42, 115, 164, 0.5)",
              width: "7%",
              alignItems: "center",
              borderRadius: 10,
            }}
          >
            <p>Preview</p>
          </div>
        </div>
      </header>
      <div className="container">
        <div className="qtype-container">
          {questionTypes.map((item, index) => (
            <div
              key={index}
              className="questionTypeDiv"
              onClick={() => handleClick(item.component)}
              draggable="true"
              onDragStart={(event) => handleDragStart(event, index)}
            >
              <p className="questionTypeText">{item.questionTypeName}</p>
            </div>
          ))}
        </div>
        <div className="qa-container">
          <div
            className="question-container"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {questionComponents.map((component, index) => (
              <div key={index}>{component}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
