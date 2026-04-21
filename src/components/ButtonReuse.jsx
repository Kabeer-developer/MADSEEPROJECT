
function Button({children,type="button",onClick}){
    <button type={type} onClick={onClick}>{children}</button>
}

export default Button;