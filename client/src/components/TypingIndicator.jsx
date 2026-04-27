import { motion, AnimatePresence } from 'framer-motion';

const TypingIndicator = ({ name = 'Someone' }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2 px-4 py-2"
    >
      <div className="flex items-center gap-1.5 px-4 py-3 glass border border-[var(--border)] rounded-2xl rounded-bl-sm">
        <div className="flex items-center gap-1">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
      <p className="text-xs text-[var(--text-muted)]">{name} is typing…</p>
    </motion.div>
  </AnimatePresence>
);

export default TypingIndicator;
