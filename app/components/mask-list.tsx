import DeleteIcon from "../icons/delete.svg";
import MaskIcon from "../icons/mask.svg";

import styles from "./home.module.scss";
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";

import { useMaskStore } from "../store/mask";
import { Mask } from "../store/mask";

import Locale from "../locales";
import { Link, useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { MaskAvatar } from "./mask";
import { useRef, useEffect } from "react";
import { showConfirm } from "./ui-lib";
import { useMobileScreen } from "../utils";

export function MaskItem(props: {
  onClick?: () => void;
  onDelete?: () => void;
  mask: Mask;
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
          title={props.mask.name}
        >
          {props.narrow ? (
            <div className={styles["chat-item-narrow"]}>
              <div className={styles["chat-item-avatar"] + " no-dark"}>
                <MaskAvatar
                  avatar={props.mask.avatar}
                  model={props.mask.modelConfig.model}
                />
              </div>
            </div>
          ) : (
            <>
              <div className={styles["chat-item-title"]}>{props.mask.name}</div>
              <div className={styles["chat-item-info"]}>
                <div className={styles["chat-item-count"]}>
                  {props.mask.context.length} prompts
                </div>
                <div className={styles["chat-item-date"]}>
                  {new Date(props.mask.createdAt).toLocaleString()}
                </div>
              </div>
            </>
          )}

          <div
            className={styles["chat-item-delete"]}
            onClickCapture={(e) => {
              props.onDelete?.();
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <DeleteIcon />
          </div>
        </div>
      )}
    </Draggable>
  );
}

export function MaskList(props: { narrow?: boolean }) {
  const [masks, selectedMask, selectMask] = useMaskStore((state) => [
    state.getAll(),
    state.get(),
    state.create,
  ]);
  const maskStore = useMaskStore();
  const navigate = useNavigate();
  const isMobileScreen = useMobileScreen();

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

    // Note: For now, we don't implement mask reordering since they are stored as a Record
    // You could implement this by adding an 'order' field to masks if needed
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="mask-list">
        {(provided) => (
          <div
            className={styles["chat-list"]}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {masks.map((item, i) => (
              <MaskItem
                mask={item}
                key={item.id}
                id={item.id}
                index={i}
                selected={selectedMask?.id === item.id}
                onClick={() => {
                  navigate(Path.Masks);
                }}
                onDelete={async () => {
                  if (
                    (!props.narrow && !isMobileScreen) ||
                    (await showConfirm(Locale.Home.DeleteChat))
                  ) {
                    maskStore.delete(item.id);
                  }
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