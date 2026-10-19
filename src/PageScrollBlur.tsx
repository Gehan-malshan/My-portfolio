import GradualBlur from './GradualBlur'

export default function PageScrollBlur() {
  return <GradualBlur className="site-scroll-blur" position="top" target="page" height={90} strength={0.6} layers={6} curve="ease-out" autoHide zIndex={22}/>
}
