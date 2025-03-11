import styles from "./home.module.scss";
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";

import { Link, useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { useRef, useEffect } from "react";
import { showConfirm } from "./ui-lib";
import { useMobileScreen } from "../utils";
import Locale from "../locales";
import SettingsIcon from "../icons/settings.svg";

export function ConfigItem(props: {
  onClick?: () => void;
  title: string;
  selected: boolean;
  id: string;
  index: number;
  narrow?: boolean;
}) {
  const draggableRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    if (props.selected && draggableRef.current) {
      draggableRef.current?.scrollIntoView({
        block: "center",
      });
    }
  }, [props.selected]);

  return (
    <Draggable draggableId={`${props.id}`} index={props.index}>
      {(provided) => (
        <div
          className={`${styles["chat-item"]} ${
            props.selected && styles["chat-item-selected"]
          }`}
          onClick={props.onClick}
          ref={(ele) => {
            draggableRef.current = ele;
            provided.innerRef(ele);
          }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          title={props.title}
        >
          {props.narrow ? (
            <div className={styles["chat-item-narrow"]}>
              <div className={styles["chat-item-avatar"] + " no-dark"}>
                <SettingsIcon />
              </div>
            </div>
          ) : (
            <>
              <div className={styles["chat-item-title"]}>{props.title}</div>
            </>
          )}
        </div>
      )}
    </Draggable>
  );
}

export function ConfigList(props: { narrow?: boolean }) {
  const navigate = useNavigate();
  const isMobileScreen = useMobileScreen();

  const configs = [
    {
      id: "general",
      title: Locale.Settings.Title,  // "General" in English, "设置" in Chinese
    }
  ];

  const onDragEnd: OnDragEndResponder = (result) => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    // For now, we don't implement reordering since we only have one item
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="config-list">
        {(provided) => (
          <div
            className={styles["chat-list"]}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {configs.map((item, i) => (
              <ConfigItem
                title={item.title}
                key={item.id}
                id={item.id}
                index={i}
                selected={false}  // We can implement selection state later
                onClick={() => {
                  navigate(Path.Settings);
                }}
                narrow={props.narrow}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
} 