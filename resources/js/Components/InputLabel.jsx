export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ms-1 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
