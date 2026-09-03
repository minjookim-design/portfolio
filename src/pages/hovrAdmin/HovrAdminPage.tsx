import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  ASSETS,
  CITIES,
  DOCUMENTS,
  HEADER_FIELDS,
  REJECTION_REASONS,
  type DetailField,
  type DocStatus,
  type DocumentCard,
} from './data'

const FONT = "font-['Inter',sans-serif]"

type Toast = { title: string; body?: string }

type DocRuntime = DocumentCard & { status: DocStatus }

function cloneDocs(): DocRuntime[] {
  return DOCUMENTS.map((d) => ({
    ...d,
    detailFields: d.detailFields.map((f) => ({ ...f })),
    status: 'pending',
  }))
}

function Icon({
  src,
  size,
  alt = '',
}: {
  src: string
  size: number
  alt?: string
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="shrink-0"
      style={{ width: size, height: size }}
    />
  )
}

function MenuIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M3.5 5h13M3.5 10h13M3.5 15h13" stroke="#0D0D0C" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
      <path
        d="M11.333 2.333a1.414 1.414 0 0 1 2 2L5.5 12.167 2.667 12.833l.666-2.833 8-7.667Z"
        stroke="#4F4F4D"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronDown() {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
      <path d="M4 6.5 8 10.5 12 6.5" stroke="#4F4F4D" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LogoGlyph({
  src,
  width,
  height,
  left,
  top,
}: {
  src: string
  width: number
  height: number
  left: number
  top: number
}) {
  return (
    <div
      className="absolute flex items-center justify-center"
      style={{ left, top, width, height }}
    >
      <div className="-scale-y-100">
        <img src={src} alt="" width={width} height={height} className="block" style={{ width, height }} />
      </div>
    </div>
  )
}

function HovrLogo() {
  return (
    <div className="relative h-[16px] w-[57px] shrink-0" aria-label="HOVR">
      <LogoGlyph src={ASSETS.logoH} width={11.759} height={14.954} left={0} top={0.19} />
      <LogoGlyph src={ASSETS.logoO} width={15.363} height={15.363} left={13.66} top={0} />
      <LogoGlyph src={ASSETS.logoVMark} width={9.454} height={11.373} left={15.81} top={4.63} />
      <LogoGlyph src={ASSETS.logoV} width={14.243} height={14.951} left={29.4} top={0.2} />
      <LogoGlyph src={ASSETS.logoR} width={11.425} height={14.948} left={45.45} top={0.2} />
    </div>
  )
}

function Pill({
  children,
  tone,
  disabled,
  onClick,
  type = 'button',
}: {
  children: ReactNode
  tone: 'select' | 'approve' | 'reject' | 'edit' | 'modal-cancel' | 'modal-reject'
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
}) {
  const toneClass = {
    select: 'bg-[#7d7e7c] text-white',
    approve: 'bg-[#4aab24] text-white',
    reject: 'bg-[#b3261e] text-white',
    edit: 'bg-[#f1f5f0] text-[#4f4f4d]',
    'modal-cancel': 'bg-[#969794] text-white',
    'modal-reject': 'bg-[#fcb3ad] text-[#4f4f4d]',
  }[tone]
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${FONT} inline-flex items-center justify-center gap-2 rounded-[30px] px-3 py-3 text-[10px] font-semibold leading-[1.2] ${toneClass} disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  )
}

function DataCell({
  label,
  value,
  pending,
  editing,
  onChange,
}: {
  label: string
  value: string
  pending?: boolean
  editing?: boolean
  onChange?: (v: string) => void
}) {
  return (
    <div className="flex min-w-0 flex-1 items-stretch">
      <div className={`${FONT} flex h-10 w-[130px] shrink-0 items-center bg-[#e2e5e1] px-[9px] text-[12px] font-semibold leading-[1.2] text-[#4f4f4d]`}>
        {label}
      </div>
      <div
        className={`flex min-w-0 flex-1 items-center justify-between px-[9px] py-3 ${
          editing ? 'bg-[#e4f4de]' : ''
        }`}
      >
        {editing ? (
          <input
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className={`${FONT} w-full min-w-0 bg-transparent text-[12px] font-normal leading-[1.2] text-[#4f4f4d] outline-none`}
          />
        ) : (
          <span className={`${FONT} min-w-0 truncate text-[12px] font-normal leading-[1.2] text-[#4f4f4d]`}>
            {value}
          </span>
        )}
        {pending && !editing ? <Icon src={ASSETS.clock} size={14} /> : null}
      </div>
    </div>
  )
}

function DetailFieldRow({
  field,
  editing,
  onChange,
}: {
  field: DetailField
  editing: boolean
  onChange: (value: string) => void
}) {
  const toneBg =
    field.tone === 'warning' ? 'bg-[#fff9da]' : field.tone === 'error' ? 'bg-[#ffebea]' : ''
  return (
    <div className="flex min-w-0 flex-1 items-stretch">
      <div className={`${FONT} flex h-10 w-[130px] shrink-0 items-center bg-[#e2e5e1] px-[9px] text-[12px] font-semibold leading-[1.2] text-[#4f4f4d]`}>
        {field.label}
      </div>
      <div
        className={`flex min-h-10 min-w-0 flex-1 items-center justify-between gap-2 px-[9px] py-3 ${
          editing ? 'bg-[#e4f4de]' : toneBg
        }`}
      >
        {editing ? (
          <input
            value={field.value}
            onChange={(e) => onChange(e.target.value)}
            className={`${FONT} w-full min-w-0 bg-transparent text-[12px] font-normal leading-[1.2] text-[#0d0d0c] outline-none`}
          />
        ) : (
          <span className={`${FONT} min-w-0 text-[12px] font-normal leading-[1.2] text-[#0d0d0c]`}>
            {field.value}
          </span>
        )}
        {!editing && field.tone === 'warning' ? <Icon src={ASSETS.warning} size={16} /> : null}
        {!editing && field.tone === 'error' ? <Icon src={ASSETS.error} size={13.33} /> : null}
      </div>
    </div>
  )
}

export function HovrAdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [nav, setNav] = useState<'dashboard' | 'enrollment' | 'active'>('enrollment')
  const [city, setCity] = useState<(typeof CITIES)[number]>('Toronto')
  const [cityOpen, setCityOpen] = useState(false)
  const [docs, setDocs] = useState<DocRuntime[]>(cloneDocs)
  const [header, setHeader] = useState(() => HEADER_FIELDS.map((f) => ({ ...f })))
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(['profile-photo']))
  const [activeId, setActiveId] = useState<string | null>('profile-photo')
  const [editing, setEditing] = useState(false)
  const [editFields, setEditFields] = useState<DetailField[]>([])
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState<string | null>(null)
  const [rejectCustom, setRejectCustom] = useState('')
  const [toast, setToast] = useState<Toast | null>(null)
  const toastTimer = useRef<number | null>(null)
  const cityRef = useRef<HTMLDivElement>(null)

  const pendingDocs = useMemo(() => docs.filter((d) => d.status === 'pending'), [docs])
  const allPendingSelected =
    pendingDocs.length > 0 && pendingDocs.every((d) => selectedIds.has(d.id))
  const nonePending = pendingDocs.length === 0
  const allApproved = docs.every((d) => d.status === 'approved')
  const active = docs.find((d) => d.id === activeId) ?? null

  const showToast = useCallback((next: Toast) => {
    setToast(next)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2800)
  }, [])

  useEffect(() => () => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
  }, [])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setCityOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const applyApprovalSideEffects = useCallback((approved: DocRuntime[], nextHeader: typeof header) => {
    const keys = new Set(approved.flatMap((d) => d.clearsHeaderKeys ?? []))
    if (keys.size === 0) return nextHeader
    return nextHeader.map((f) => (keys.has(f.key) ? { ...f, pending: false } : f))
  }, [])

  const approveIds = (ids: string[]) => {
    const idSet = new Set(ids)
    const approvedNow = docs.filter((d) => idSet.has(d.id) && d.status === 'pending')
    if (approvedNow.length === 0) return
    setDocs((prev) =>
      prev.map((d) => (idSet.has(d.id) && d.status === 'pending' ? { ...d, status: 'approved' as const } : d)),
    )
    setHeader((h) => applyApprovalSideEffects(approvedNow, h))
    setSelectedIds(new Set())
    setEditing(false)
    showToast({ title: 'Document Approved' })
  }

  const onSelectAll = () => {
    if (allApproved) return
    if (allPendingSelected) {
      setSelectedIds(new Set())
      return
    }
    setSelectedIds(new Set(pendingDocs.map((d) => d.id)))
  }

  const onApprove = () => {
    if (allApproved) return
    const ids = [...selectedIds].filter((id) => docs.find((d) => d.id === id)?.status === 'pending')
    if (ids.length === 0 && active?.status === 'pending') {
      approveIds([active.id])
      return
    }
    if (ids.length === 0) return
    approveIds(ids)
  }

  const onCardClick = (id: string) => {
    setEditing(false)
    setActiveId(id)
    setSidebarOpen(false)
    if (selectedIds.size > 1) return
    setSelectedIds(new Set([id]))
  }

  const startEdit = () => {
    if (!active || active.status === 'rejected') return
    setEditFields(active.detailFields.map((f) => ({ ...f })))
    setEditing(true)
  }

  const saveEdit = () => {
    if (!active) return
    setDocs((prev) =>
      prev.map((d) => (d.id === active.id ? { ...d, detailFields: editFields.map((f) => ({ ...f })) } : d)),
    )
    if (active.id === 'vehicle-photos') {
      const model = editFields.find((f) => f.id === 'model')?.value
      const year = editFields.find((f) => f.id === 'year')?.value
      const plate = editFields.find((f) => f.id === 'plate')?.value
      setHeader((h) =>
        h.map((f) => {
          if (f.key === 'vehicleModel' && model) {
            const make = editFields.find((row) => row.id === 'make')?.value ?? 'Tesla'
            return { ...f, value: `${make} ${model}` }
          }
          if (f.key === 'vehicleYear' && year) return { ...f, value: year }
          if (f.key === 'licensePlate' && plate) return { ...f, value: plate }
          return f
        }),
      )
    }
    if (active.id === 'license') {
      const first = editFields.find((f) => f.id === 'firstName')?.value
      const last = editFields.find((f) => f.id === 'lastName')?.value
      if (first && last) {
        setHeader((h) => h.map((f) => (f.key === 'driverName' ? { ...f, value: `${first} ${last}` } : f)))
      }
    }
    setEditing(false)
  }

  const confirmReject = () => {
    if (!active || !rejectReason) return
    if (rejectReason.startsWith('Other') && !rejectCustom.trim()) return
    setDocs((prev) => prev.map((d) => (d.id === active.id ? { ...d, status: 'rejected' as const } : d)))
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(active.id)
      return next
    })
    setRejectOpen(false)
    setRejectReason(null)
    setRejectCustom('')
    setEditing(false)
    showToast({
      title: 'Document Rejected',
      body: 'The specified reason has been sent to the driver via SMS.',
    })
  }

  const headerRows: (typeof header)[] = [header.slice(0, 3), header.slice(3, 6), header.slice(6, 9)]
  const previewFields = editing ? editFields : active?.detailFields ?? []
  const otherSelected = rejectReason?.startsWith('Other') ?? false

  return (
    <div className={`${FONT} flex h-[100dvh] min-h-0 w-full flex-col bg-white text-[#0d0d0c]`}>
      <header className="relative z-20 flex h-[50px] shrink-0 items-center border-b border-[#ccceca] bg-white px-4">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen((v) => !v)}
            className="flex size-[34px] items-center justify-center rounded-lg"
          >
            <MenuIcon />
          </button>
          <HovrLogo />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="relative" ref={cityRef}>
            <button
              type="button"
              onClick={() => setCityOpen((v) => !v)}
              className={`${FONT} flex w-[119px] items-center gap-2.5 rounded-lg bg-[#f1f5f0] py-1.5 pl-3 pr-2 text-left text-[10px] font-semibold leading-[1.2] text-[#4f4f4d]`}
            >
              <span className="min-w-0 flex-1 truncate">{city}</span>
              <ChevronDown />
            </button>
            {cityOpen ? (
              <ul className="absolute right-0 top-[calc(100%+4px)] z-30 w-[119px] overflow-hidden rounded-lg border border-[#ccceca] bg-white shadow-sm">
                {CITIES.map((c) => (
                  <li key={c}>
                    <button
                      type="button"
                      onClick={() => {
                        setCity(c)
                        setCityOpen(false)
                      }}
                      className={`${FONT} w-full px-3 py-2 text-left text-[10px] font-semibold text-[#4f4f4d] hover:bg-[#f1f5f0] ${
                        c === city ? 'text-[#3e901e]' : ''
                      }`}
                    >
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="Sign out"
            onClick={() => showToast({ title: 'Signed out' })}
            className="flex size-[34px] items-center justify-center rounded-lg"
          >
            <Icon src={ASSETS.logout} size={20} />
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside
          className="shrink-0 overflow-hidden bg-[#f1f5f0] transition-[width] duration-300 ease-out"
          style={{ width: sidebarOpen ? 253 : 0 }}
        >
          <nav className="flex w-[253px] flex-col gap-0 px-4 pt-4">
            <button
              type="button"
              onClick={() => setNav('dashboard')}
              className={`${FONT} h-10 w-[225px] rounded-lg px-2 text-left text-[12px] font-semibold leading-[14px] ${
                nav === 'dashboard' ? 'bg-[#f1f5f0] text-[#3e901e]' : 'text-[#4f4f4d]'
              }`}
            >
              Dashboard
            </button>
            <div className="mt-0">
              <div className={`${FONT} flex h-10 w-[225px] items-center rounded-md bg-[#f1f5f0] px-2 text-[10px] font-semibold leading-[12px] text-[#7d7e7c]`}>
                Drivers
              </div>
              <button
                type="button"
                onClick={() => setNav('enrollment')}
                className={`${FONT} h-10 w-[225px] rounded-lg px-2 text-left text-[12px] font-semibold leading-[14px] ${
                  nav === 'enrollment' ? 'text-[#3e901e]' : 'text-[#4f4f4d]'
                }`}
              >
                Driver Enrollment
              </button>
              <button
                type="button"
                onClick={() => setNav('active')}
                className={`${FONT} h-10 w-[225px] rounded-lg px-2 text-left text-[12px] font-semibold leading-[14px] ${
                  nav === 'active' ? 'text-[#3e901e]' : 'text-[#4f4f4d]'
                }`}
              >
                Active Drivers
              </button>
            </div>
          </nav>
        </aside>

        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-6 pb-16 pt-4 transition-[padding] duration-300 md:px-10">
          {nav !== 'enrollment' ? (
            <div className="flex h-[60vh] items-center justify-center">
              <p className={`${FONT} text-[15px] text-[#656664]`}>
                {nav === 'dashboard' ? 'Dashboard — no widgets in this prototype.' : 'Active Drivers — no records in this prototype.'}
              </p>
            </div>
          ) : (
            <div className="mx-auto flex w-full min-w-0 max-w-[1330px] flex-col gap-3">
              <div className="flex flex-col gap-1">
                <nav aria-label="Breadcrumb" className={`${FONT} flex gap-2.5 text-[12px] leading-[1.2] text-[#656664]`}>
                  <button type="button" onClick={() => setActiveId(null)} className="hover:text-[#3e901e]">
                    Driver Enrollment
                  </button>
                  <span>/</span>
                  <span className="font-semibold text-[#0d0d0c]">Driver Information</span>
                </nav>
                <h1 className={`${FONT} text-[24px] font-semibold leading-[1.2] tracking-[-0.48px] text-black`}>
                  Driver Information
                </h1>
              </div>

              <div className="flex min-w-0 items-start gap-3">
                <button
                  type="button"
                  onClick={() => onCardClick('profile-photo')}
                  className="relative h-[168px] w-[140px] shrink-0 overflow-hidden rounded-sm"
                >
                  <img
                    src={ASSETS.photo}
                    alt="John Doe"
                    width={140}
                    height={168}
                    className="h-full w-full object-cover"
                    style={{ width: 140, height: 168 }}
                  />
                  {docs[0]?.status === 'pending' ? (
                    <span className="absolute bottom-2 right-2">
                      <Icon src={ASSETS.clockBadge} size={18} />
                    </span>
                  ) : null}
                </button>

                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <div className="flex min-w-0 flex-col overflow-x-auto">
                    {headerRows.map((row, i) => (
                      <div
                        key={i}
                        className={`flex items-stretch ${i === 0 ? 'border-t' : ''} ${
                          i === 2 ? 'border-b' : ''
                        } border-[#ccceca]`}
                      >
                        {row.map((field) => (
                          <DataCell
                            key={field.key}
                            label={field.label}
                            value={field.value}
                            pending={field.pending}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Pill tone="select" disabled={nonePending} onClick={onSelectAll}>
                      {allPendingSelected ? 'Unselect All' : 'Select All'}
                    </Pill>
                    <Pill tone="approve" disabled={nonePending} onClick={onApprove}>
                      {allApproved ? 'Approved' : 'Approve'}
                    </Pill>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start gap-4 xl:flex-row">
                <div className="flex w-full max-w-[480px] shrink-0 flex-col gap-2.5">
                  {docs.map((doc) => {
                    const selected = selectedIds.has(doc.id) || activeId === doc.id
                    const compact = doc.status !== 'pending'
                    return (
                      <button
                        type="button"
                        key={doc.id}
                        onClick={() => onCardClick(doc.id)}
                        className={`w-full rounded-[10px] p-5 text-left transition-colors ${
                          selected
                            ? 'border border-[#327519] bg-[#e4f4de]'
                            : 'border border-transparent bg-[#f1f5f0]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={`${FONT} text-[15px] font-semibold leading-[1.2] ${
                              !compact && doc.match === 'mismatch'
                                ? 'text-[#b3261e]'
                                : 'text-[#0d0d0c]'
                            }`}
                          >
                            {doc.title}
                          </p>
                          {doc.status === 'approved' ? (
                            <span className={`${FONT} flex items-center gap-0.5 text-[12px] leading-[1.2] text-[#327519]`}>
                              Approved
                              <Icon src={ASSETS.check} size={14} />
                            </span>
                          ) : doc.status === 'rejected' ? (
                            <span className={`${FONT} text-[12px] leading-[1.2] text-[#b3261e]`}>Rejected</span>
                          ) : (
                            <span className={`${FONT} flex items-center gap-0.5 text-[12px] leading-[1.2] text-[#656664]`}>
                              Pending
                              <Icon src={ASSETS.clock} size={14} />
                            </span>
                          )}
                        </div>
                        {!compact && doc.match === 'mismatch' ? (
                          <div className="mt-2.5 flex items-center gap-0.5">
                            <p className={`${FONT} text-[12px] font-normal leading-[1.2] text-[#b3261e]`}>
                              Image doesn’t match typed info
                            </p>
                            <Icon src={ASSETS.error} size={13.33} />
                          </div>
                        ) : null}
                        {!compact && doc.match === 'match' ? (
                          <div className="mt-2.5 flex items-center gap-0.5">
                            <p className={`${FONT} text-[12px] font-normal leading-[1.2] text-[#327519]`}>
                              Image matches typed info
                            </p>
                            <Icon src={ASSETS.check} size={14} />
                          </div>
                        ) : null}
                        {!compact && doc.comparisons.length > 0 ? (
                          <div className="mt-5 flex flex-col gap-2">
                            {doc.comparisons.map((row) => (
                              <div key={row.label} className="flex items-center justify-between gap-3">
                                <p className={`${FONT} text-[12px] font-semibold leading-[1.2] text-[#4f4f4d]`}>
                                  {row.label}
                                </p>
                                <p className={`${FONT} text-[12px] font-normal leading-[1.2] text-[#656664]`}>
                                  {row.value}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </button>
                    )
                  })}
                </div>

                {active ? (
                  <div className="flex min-w-0 flex-1 flex-col gap-4">
                    <div className="flex flex-wrap items-start gap-1">
                      <h2 className={`${FONT} min-w-0 flex-1 text-[18px] font-semibold leading-[1.2] tracking-[-0.18px] text-black`}>
                        {active.previewTitle ?? active.title}
                      </h2>
                      <div className="flex shrink-0 flex-wrap justify-end gap-1">
                      <Pill
                        tone="reject"
                        disabled={active.status === 'rejected'}
                        onClick={() => {
                          setRejectReason(null)
                          setRejectCustom('')
                          setRejectOpen(true)
                        }}
                      >
                        Reject
                      </Pill>
                      {editing ? (
                        <>
                          <Pill tone="edit" onClick={() => setEditing(false)}>
                            Cancel
                          </Pill>
                          <Pill tone="approve" onClick={saveEdit}>
                            Save
                          </Pill>
                        </>
                      ) : (
                        <Pill tone="edit" disabled={active.status === 'rejected'} onClick={startEdit}>
                          Edit
                          <PencilIcon />
                        </Pill>
                      )}
                      </div>
                    </div>

                    {previewFields.length > 0 ? (
                      <div className="flex flex-col border-b border-[#ccceca]">
                        {Array.from({ length: Math.ceil(previewFields.length / 2) }, (_, i) => {
                          const a = previewFields[i * 2]
                          const b = previewFields[i * 2 + 1]
                          return (
                            <div key={a.id} className="flex items-stretch border-t border-[#ccceca]">
                              <DetailFieldRow
                                field={a}
                                editing={editing}
                                onChange={(value) =>
                                  setEditFields((prev) => prev.map((f) => (f.id === a.id ? { ...f, value } : f)))
                                }
                              />
                              {b ? (
                                <DetailFieldRow
                                  field={b}
                                  editing={editing}
                                  onChange={(value) =>
                                    setEditFields((prev) => prev.map((f) => (f.id === b.id ? { ...f, value } : f)))
                                  }
                                />
                              ) : (
                                <div className="flex-1" />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ) : null}

                    <div className="relative flex flex-col gap-3">
                      {active.images.map((img, i) =>
                        img.src ? (
                          <div
                            key={img.label}
                            className="relative overflow-hidden rounded-[10px]"
                            style={img.maxWidthPx ? { maxWidth: img.maxWidthPx } : undefined}
                          >
                            <img
                              src={img.src}
                              alt={img.label}
                              width={img.maxWidthPx ?? 820}
                              height={img.maxWidthPx ? Math.round(img.maxWidthPx * 1.13) : 520}
                              className="block h-auto w-full object-contain"
                            />
                            {toast && i === 0 ? (
                              <div className="pointer-events-none absolute bottom-[28%] left-6 max-w-[280px] rounded-lg bg-[#0d0d0c] px-4 py-3 text-white shadow-lg">
                                <p className={`${FONT} text-[12px] font-semibold leading-[1.2]`}>{toast.title}</p>
                                {toast.body ? (
                                  <p className={`${FONT} mt-1 text-[12px] font-normal leading-[1.3] text-white/80`}>
                                    {toast.body}
                                  </p>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        ) : null,
                      )}
                      {toast && active.images.every((img) => !img.src) ? (
                        <div className="max-w-[280px] rounded-lg bg-[#0d0d0c] px-4 py-3 text-white shadow-lg">
                          <p className={`${FONT} text-[12px] font-semibold leading-[1.2]`}>{toast.title}</p>
                          {toast.body ? (
                            <p className={`${FONT} mt-1 text-[12px] font-normal leading-[1.3] text-white/80`}>
                              {toast.body}
                            </p>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : toast ? (
                  <div className="flex min-w-0 flex-1 items-end pb-8">
                    <div className="rounded-lg bg-[#0d0d0c] px-4 py-3 text-white">
                      <p className={`${FONT} text-[12px] font-semibold leading-[1.2]`}>{toast.title}</p>
                      {toast.body ? (
                        <p className={`${FONT} mt-1 text-[12px] font-normal leading-[1.3] text-white/80`}>{toast.body}</p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </main>
      </div>

      {rejectOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
          <div
            role="dialog"
            aria-labelledby="reject-title"
            className="flex w-[570px] max-w-full flex-col items-center gap-6 rounded-[10px] bg-white px-10 py-6 shadow-[0_16px_16px_rgba(12,12,13,0.1),0_4px_2px_rgba(12,12,13,0.05)]"
          >
            <div className="flex w-full flex-col gap-1">
              <h2 id="reject-title" className={`${FONT} text-[18px] font-semibold leading-[1.2] tracking-[-0.18px] text-black`}>
                Choose a rejection reason
              </h2>
              <p className={`${FONT} text-[12px] font-normal leading-[1.2] text-[#969794]`}>
                The selected reason, including any custom entry, will be sent to the driver as an automatic message.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3.5">
              {REJECTION_REASONS.map((reason) => (
                <label key={reason} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="reject-reason"
                    checked={rejectReason === reason}
                    onChange={() => setRejectReason(reason)}
                    className="size-4 accent-[#3e901e]"
                  />
                  <span className={`${FONT} text-[12px] font-normal leading-[1.2] text-[#0d0d0c]`}>{reason}</span>
                </label>
              ))}
              <textarea
                disabled={!otherSelected}
                value={rejectCustom}
                onChange={(e) => setRejectCustom(e.target.value)}
                placeholder="Type the reason for rejection..."
                className={`${FONT} h-[72px] w-full resize-none rounded-md bg-[#e2e5e1] px-3 py-2 text-[12px] text-[#4f4f4d] outline-none placeholder:text-[#969794] disabled:opacity-60`}
              />
            </div>
            <div className="flex gap-2">
              <Pill
                tone="modal-cancel"
                onClick={() => {
                  setRejectOpen(false)
                  setRejectReason(null)
                  setRejectCustom('')
                }}
              >
                Cancel
              </Pill>
              <Pill
                tone="modal-reject"
                disabled={!rejectReason || (otherSelected && !rejectCustom.trim())}
                onClick={confirmReject}
              >
                Reject
              </Pill>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
