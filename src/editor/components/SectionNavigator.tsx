import { DndContext, PointerSensor, KeyboardSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Copy, Eye, EyeOff, GripVertical, Plus, Trash2, Megaphone, ShoppingBag, LayoutGrid, Image, Star, HelpCircle, MousePointerClick, Palette } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Section, SectionType } from "../types";
import { SECTION_LIBRARY } from "../demo/demoDocument";

export const SECTION_ICONS: Record<SectionType, typeof Megaphone> = {
  announcement: Megaphone, hero: ShoppingBag, features: LayoutGrid, imageText: Image, reviews: Star, faq: HelpCircle, cta: MousePointerClick,
};

interface Props {
  sections: Section[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onMove: (from: number, to: number) => void;
  onAdd: (type: SectionType) => void;
  onDuplicate: (id: string) => void;
  onToggleHidden: (id: string) => void;
  onRemove: (id: string) => void;
}

export function SectionNavigator(p: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const onDragEnd = (e: DragEndEvent) => {
    if (!e.over || e.active.id === e.over.id) return;
    p.onMove(p.sections.findIndex((s) => s.id === e.active.id), p.sections.findIndex((s) => s.id === e.over!.id));
  };

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r bg-panel">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div>
          <h3 className="font-display text-lg">Sections</h3>
          <p className="text-xs text-muted-foreground">Drag to reorder</p>
        </div>
        <AddMenu onAdd={p.onAdd} />
      </div>

      <button onClick={() => p.onSelect(null)}
        className={`mx-3 mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${p.selectedId === null ? "bg-accent text-accent-foreground" : "hover:bg-muted"}`}>
        <Palette size={16} /> <span className="font-medium">Theme & typography</span>
      </button>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={p.sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <ul className="space-y-1">
              {p.sections.map((s) => <Row key={s.id} s={s} {...p} />)}
            </ul>
          </SortableContext>
        </DndContext>
      </div>
    </aside>
  );
}

function Row({ s, selectedId, onSelect, onDuplicate, onToggleHidden, onRemove }: { s: Section } & Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: s.id });
  const Icon = SECTION_ICONS[s.type];
  const selected = selectedId === s.id;
  return (
    <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group flex items-center gap-1 rounded-lg border px-1.5 py-1.5 text-sm transition ${isDragging ? "z-10 border-primary bg-card shadow-glow" : selected ? "border-primary/30 bg-accent" : "border-transparent hover:bg-muted"}`}>
      <button {...attributes} {...listeners} aria-label="Drag to reorder" className="cursor-grab touch-none rounded p-1 text-muted-foreground hover:text-foreground active:cursor-grabbing">
        <GripVertical size={14} />
      </button>
      <button onClick={() => onSelect(s.id)} className={`flex min-w-0 flex-1 items-center gap-2.5 text-left ${s.hidden ? "opacity-45" : ""}`}>
        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-md ${selected ? "bg-brand text-primary-foreground" : "bg-muted text-muted-foreground"}`}><Icon size={14} /></span>
        <span className={`truncate ${selected ? "font-semibold text-accent-foreground" : "font-medium"}`}>{s.name}</span>
      </button>
      <div className="flex opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
        <IconBtn label={s.hidden ? "Show" : "Hide"} onClick={() => onToggleHidden(s.id)}>{s.hidden ? <EyeOff size={13} /> : <Eye size={13} />}</IconBtn>
        <IconBtn label="Duplicate" onClick={() => onDuplicate(s.id)}><Copy size={13} /></IconBtn>
        <IconBtn label="Delete" onClick={() => onRemove(s.id)} danger><Trash2 size={13} /></IconBtn>
      </div>
      {s.hidden && <EyeOff size={13} className="mr-1 text-muted-foreground group-hover:hidden" />}
    </li>
  );
}

function IconBtn({ children, label, onClick, danger }: { children: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button aria-label={label} title={label} onClick={onClick}
      className={`rounded p-1.5 text-muted-foreground transition hover:bg-card ${danger ? "hover:text-destructive" : "hover:text-foreground"}`}>
      {children}
    </button>
  );
}

function AddMenu({ onAdd }: { onAdd: (t: SectionType) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button aria-label="Add section" className="grid h-8 w-8 place-items-center rounded-full bg-brand text-primary-foreground shadow-glow transition hover:scale-105"><Plus size={16} /></button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {SECTION_LIBRARY.map((l) => {
          const Icon = SECTION_ICONS[l.type];
          return (
            <DropdownMenuItem key={l.type} onSelect={() => onAdd(l.type)} className="gap-3 py-2">
              <span className="grid h-8 w-8 place-items-center rounded-md bg-accent text-accent-foreground"><Icon size={15} /></span>
              <span><span className="block text-sm font-medium">{l.label}</span><span className="block text-xs text-muted-foreground">{l.description}</span></span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
