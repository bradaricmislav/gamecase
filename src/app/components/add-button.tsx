"use client";

interface AddButtonProps {
  gameId: number;
}

export default function AddButton({ gameId }: AddButtonProps) {
  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Dodana igra ID:", gameId);
  };

  return (
    <button className="games-list__add" onClick={handleAdd}>
      + ADD
    </button>
  );
}
