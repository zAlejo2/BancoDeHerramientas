export const Button = ({ name, type }) => {
    const typeColor = type === 'submit'
        ? 'bg-[#212121] hover:bg-[#9e9e9e] active:bg-[#757575]'
        : type === 'modify' ? 'hover:bg-sky-600/60 bg-sky-600/50 active:bg-sky-600/75'
            : type === 'delete' ? 'hover:bg-red-600/60 bg-red-600/50 active:bg-red-600/75'
                : ''
    return (
        <button
            className={`${typeColor} py-2 px-4 rounded-lg text-center w-full text-neutral-100 font-bold`}
            type="submit"
        >
            {name}
        </button>
    )
}
